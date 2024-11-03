const { client } = require('../config/config');
const stringSimilarity = require('string-similarity');
const { getCoursesFromDB } = require('../database/database');

// ฟังก์ชันจัดการกับ event ที่ได้รับจาก LINE
async function handleEvent(event, intentsData) {
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return null;
    }

    const userMessage = event.message.text;

    if (!intentsData || intentsData.length === 0) {
      await client.replyMessage(event.replyToken, { type: 'text', text: 'ขออภัย ไม่พบข้อมูลคำตอบในขณะนี้' });
      return { status: 'No data' };
    }

    const trainingPhrases = intentsData.flatMap(intent => intent.training_phrases);

    const bestMatch = stringSimilarity.findBestMatch(userMessage, trainingPhrases).bestMatch;

    if (bestMatch.rating > 0.5) {
      const matchedIntent = intentsData.find(intent => 
        intent.training_phrases.includes(bestMatch.target)
      );
//-----------------------------------------------------------------------------------------------------------
      if (matchedIntent.intent_name === 'Course Inquiry') {
        const subject = await getCoursesFromDB();

        if (subject.length > 0) {
          const subjectList = subject.map(subj => 
            `รหัสวิชา : ${subj.subject_code} ชื่อวิชา : ${subj.subject_name}`
          ).join('\n');

          await client.replyMessage(event.replyToken, { type: 'text', text: subjectList });
          return { status: 'Success', response: subjectList };
        } else {
          await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง subject' });
          return { status: 'No subject Data' };
        }
      }
//-----------------------------------------------------------------------------------------------------------------------------
      const response = matchedIntent.intent_name;
      await client.replyMessage(event.replyToken, { type: 'text', text: response });
      return { status: 'Success', response };
    } else {
      await client.replyMessage(event.replyToken, { type: 'text', text: 'ขออภัย ฉันไม่เข้าใจคำถามของคุณ' });
      return { status: 'No match' };
    }
  } catch (error) {
    console.error('Error handling event:', error);
    throw error;
  }
}

module.exports = {
  handleEvent,
};
