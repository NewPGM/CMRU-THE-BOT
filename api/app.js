const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const webhookRoutes = require('../api/routes/webhook');

dotenv.config();

const app = express();
app.use(cors());

// Use the webhook routes
app.use('/webhook', webhookRoutes);
app.get('/', (req, res) => {
          res.send('Hello, world!');
})

const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
<<<<<<< HEAD:api/app.js
module.exports = app;
=======
//
>>>>>>> 9eab7c8d44cccb6a96614fdd2c0ba30479c07c43:app.js
