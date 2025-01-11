const express = require('express');
const line = require('@line/bot-sdk');
const { handleEvent } = require('../routes/lineHandler');
const { getIntentsAndTrainingPhrasesFromDB } = require('../services/database');
const { config } = require('../config/config');

const router = express.Router();

router.post('/', line.middleware(config), async (req, res) => {
  try {
    console.log('Received webhook event:', req.body.events);
    const events = req.body.events;

    if (!events || events.length === 0) {
      return res.status(200).send('No events to process.');
    }

    const intentsData = await getIntentsAndTrainingPhrasesFromDB();
    const results = await Promise.all(events.map(event => handleEvent(event, intentsData)));

    res.status(200).json(results);
  } catch (err) {
    console.error('Error in webhook:', err);
    res.status(500).send('Error processing the webhook.');
  }
  console.log('Event data:', events);
  console.error('Error details:', err.message, err.stack);
});

module.exports = router;
