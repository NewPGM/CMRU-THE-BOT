const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// MySQL connection pooling configuration
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, 
});

// ฟังก์ชันสำหรับดึงข้อมูล intents และ training phrases จากฐานข้อมูล
async function getIntentsAndTrainingPhrasesFromDB() {
  try {
    const [intents] = await pool.query('SELECT intent_id, intent_name FROM intents');
    const [trainingPhrases] = await pool.query('SELECT intent_id, phrase FROM training_phrases');

    const intentsData = intents.map(intent => {
      return {
        intent_id: intent.intent_id,
        intent_name: intent.intent_name,
        training_phrases: trainingPhrases
          .filter(phrase => phrase.intent_id === intent.intent_id)
          .map(phrase => phrase.phrase),
      };
    });

    return intentsData;
  } catch (error) {
    console.error('Error fetching intents and training phrases from database:', error);
    throw new Error('Database query failed');
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลจากตาราง subject
async function getCoursesFromDB() {
  try {
    const [subject] = await pool.query('SELECT * FROM subjects;');
    return subject;
  } catch (error) {
    console.error('Error fetching courses from database:', error);
    throw new Error('Database query failed');
  }
}

module.exports = {
  getIntentsAndTrainingPhrasesFromDB,
  getCoursesFromDB,
};
