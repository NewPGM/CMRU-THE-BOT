const express = require('express');
const line = require('@line/bot-sdk');
const dotenv = require('dotenv');
const stringSimilarity = require('string-similarity');
const fs = require('fs');

dotenv.config();

const app = express();

// Line configuration
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

// Load intents from intents.json
const intentsData = JSON.parse(fs.readFileSync('intents.json'));

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  const trainingPhrases = intentsData.intents.flatMap(intent => intent.trainingPhrases);
  const bestMatch = stringSimilarity.findBestMatch(userMessage, trainingPhrases).bestMatch;

  // If the similarity score is high, respond with the matched intent's response
  if (bestMatch.rating > 0.5) {
    const matchedIntent = intentsData.intents.find(intent => intent.trainingPhrases.includes(bestMatch.target));
    const response = matchedIntent.responses[0];
    return client.replyMessage(event.replyToken, { type: 'text', text: response });
  } else {
    return client.replyMessage(event.replyToken, { type: 'text', text: 'ขออภัย ฉันไม่เข้าใจคำถามของคุณ' });
  }
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
