const { client } = require('../config/config');
const stringSimilarity = require('string-similarity');
const { getsubjectsFromDB } = require('../database/database');
const { getLocationFromDB } = require('../database/database');
const { getcoursesFromDB } = require('../database/database');
const { getDegreeProgramsFromDB } = require('../database/database');
const { getDepartmentHistoryFromDB } = require('../database/database');
const { getInstructorsFromDB } = require('../database/database');
const { getProgramSubjectsFromDB } = require('../database/database');
const { getresponsibilitiesFromDB } = require('../database/database');
const { getroomsFromDB } = require('../database/database');
const { getPhilosophyFromDB } = require('../database/database');

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
        const subject = await getsubjectsFromDB();

        if (subject.length > 0) {
          const subjectList = subject.map(subj => 
            `รหัสวิชา : ${subj.subject_code} 
ชื่อวิชา : ${subj.subject_name}
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

          ).join('\n');

          await client.replyMessage(event.replyToken, { type: 'text', text: subjectList });
          return { status: 'Success', response: subjectList };
        } else {
          await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง subject' });
          return { status: 'No subject Data' };
        }
      }
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'Locations') {
  const Locations = await getLocationFromDB();

  if (Locations.length > 0) {
    const LocationsList = Locations.map(Loca => 
      `อยู่ที่อาคาร : ${Loca.building} 
ที่อยู่ : ${Loca.address}`   

    ).join('\n');

    await client.replyMessage(event.replyToken, { type: 'text', text: LocationsList });
    return { status: 'Success', response: LocationsList };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง Locations' });
    return { status: 'No subject Data' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'Dp') {
  const courses = await getcoursesFromDB();

  if (courses.length > 0) {
    const coursesList = courses.map(course => 
      `ลำดับ : ${course.course_id} 
หลักสูตร : ${course.course_name} 
ชื่อย่อ : ${course.abbreviation} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    await client.replyMessage(event.replyToken, { type: 'text', text: coursesList });
    return { status: 'Success', response: coursesList };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง courses' });
    return { status: 'No subject Data' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'Tf') {
  const degree_programs = await getDegreeProgramsFromDB();

  if (degree_programs.length > 0) {
    const degree_programsList = degree_programs.map(degree => 
      `หลักสูตร : ${degree.full_name} 
ชื่อย่อ : ${degree.abbreviation} 
ค่าเทอม : ${degree.tuition_fee} บาท/เทอม
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    await client.replyMessage(event.replyToken, { type: 'text', text: degree_programsList });
    return { status: 'Success', response: degree_programsList };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง degree_programs' });
    return { status: 'No subject Data' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'Dh') {
  const department_history = await getDepartmentHistoryFromDB();

  if (department_history.length > 0) {
    const department_historyList = department_history.map(department => 
      `ในปี พ.ศ. : ${department.year} 
่  ${department.event_description} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    await client.replyMessage(event.replyToken, { type: 'text', text: department_historyList });
    return { status: 'Success', response: department_historyList };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง department_history' });
    return { status: 'No subject Data' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
//จารย์ผู้รับผิดชอบหลักสูตร :  ${instructor.responsibility_id === null ? 'ไม่มีข้อมูล' : instructor.description}
//จารย์ผู้รับผิดชอบหลักสูตร :  ${instructor.phone_number === null ? 'ไม่มีข้อมูล' : instructor.phone_number}
if (matchedIntent.intent_name === 'Itt') {
  const instructors = await getInstructorsFromDB();

  if (instructors.length > 0) {
    const instructorsList = instructors.map(instructor => 
      `ชื่อ: ${instructor.name} 
่  Emall : ${instructor.email === 'null' || instructor.email == null ? 'ไม่มีข้อมูล' : instructor.email} 
  ห้องพักอาจารย์ : ${instructor.room_name === 'null' || instructor.room_name == null ? 'ไม่มีข้อมูล' : instructor.room_name}
   เบอร์โทร :  ${instructor.phone_number === null ? 'ไม่มีเบอร์โทร' : instructor.phone_number}
  
  
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    const messageText = `ได้ครับ นี้คือรายชื่ออาจารย์ทั้งหมดในภาควิชาคอมพิวเตอร์ :\n\n${instructorsList}`;

    await client.replyMessage(event.replyToken, { type: 'text', text: messageText });
    return { status: 'Success', response: messageText };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง instructors' });
    return { status: 'No subject Data' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'Philosophy') {
  const philosophy = await getPhilosophyFromDB();

  if (philosophy.length > 0) {
    const philosophyList = philosophy.map(philosophys => 
      `${philosophys.Philosophy_name} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    await client.replyMessage(event.replyToken, { type: 'text', text: philosophyList });
    return { status: 'Success', response: philosophyList };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง philosophy' });
    return { status: 'No subject Data' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'BachelorPrograms ') {
  const degree_programs = await getDegreeProgramsFromDB();
  
  // ฟิลเตอร์หาหลักสูตรปริญญาตรี โดยตรวจสอบค่า 'Bachelor_Programs' ว่าตรงกับ 'หลักสูตรปริญญาตรี'
  const bachelorPrograms = degree_programs.filter(degree => degree.Bachelor_Programs && degree.Bachelor_Programs === 'หลักสูตรปริญญาตรี');

  if (bachelorPrograms.length > 0) {
    const degree_programsList = bachelorPrograms.map(degree => 
      `หลักสูตร : ${degree.full_name} 
ชื่อย่อ : ${degree.abbreviation} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`
    ).join('\n');

    await client.replyMessage(event.replyToken, { type: 'text', text: degree_programsList });
    return { status: 'Success', response: degree_programsList };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบหลักสูตรปริญญาตรีในระบบ' });
    return { status: 'No Bachelor Programs' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'degreePrograms') {
  const degree_programs = await getDegreeProgramsFromDB();
  
  // ฟิลเตอร์หาหลักสูตรปริญญาตรี โดยตรวจสอบค่า 'Bachelor_Programs' ว่าตรงกับ 'หลักสูตรปริญญาตรี'
  const bachelorPrograms = degree_programs.filter(degree => degree.Bachelor_Programs && degree.Bachelor_Programs === 'หลักสูตรปริญญาโท');

  if (bachelorPrograms.length > 0) {
    const degree_programsList = bachelorPrograms.map(degree => 
      `หลักสูตร : ${degree.full_name} 
ชื่อย่อ : ${degree.abbreviation} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`
    ).join('\n');

    await client.replyMessage(event.replyToken, { type: 'text', text: degree_programsList });
    return { status: 'Success', response: degree_programsList };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบหลักสูตรปริญญาตรีในระบบ' });
    return { status: 'No Bachelor Programs' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'CS') {
  const program_subjects = await getProgramSubjectsFromDB();
  const CM = program_subjects.filter(program_subject => program_subject.full_name && program_subject.full_name === 'วิทยาศาสตรบัณฑิต สาขาวิทยาการคอมพิวเตอร์');

  if (program_subjects.length > 0) {
    const program_subjectsList = CM.map(program_subject => 
      `รหัสวิชา : ${program_subject.subject_code} 
ชื่อวิชา : ${program_subject.subject_name} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    const messageText = `นี้คือวิชาหลักเบื้องต้นของสาขาวิทยาการคอมพิวเตอร์เปิดสอน:\n\n${program_subjectsList}`;

    await client.replyMessage(event.replyToken, { type: 'text', text: messageText });
    return { status: 'Success', response: messageText };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง program_subjects' });
    return { status: 'No subject Data' };
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
if (matchedIntent.intent_name === 'เทคโนโลยีเว็บ') {
  const program_subjects = await getProgramSubjectsFromDB();
  const CM = program_subjects.filter(program_subject => program_subject.full_name && program_subject.full_name === 'วิทยาศาสตรบัณฑิต สาขาเทคโนโลยีเว็บ');

  if (program_subjects.length > 0) {
    const program_subjectsList = CM.map(program_subject => 
      `รหัสวิชา : ${program_subject.subject_code} 
ชื่อวิชา : ${program_subject.subject_name} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    const messageText = `นี้คือวิชาหลักเบื้องต้นของสาขาเทคโนโลยีเว็บเปิดสอน:\n\n${program_subjectsList}`;

    await client.replyMessage(event.replyToken, { type: 'text', text: messageText });
    return { status: 'Success', response: messageText };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง program_subjects' });
    return { status: 'No subject Data' };
  }
}
//----------------------------------------------------------------------------------------------------------------------------- 

if (matchedIntent.intent_name === 'คอมพิวเตอร์ศึกษา') {
  const program_subjects = await getProgramSubjectsFromDB();
  const CM = program_subjects.filter(program_subject => program_subject.full_name && program_subject.full_name === 'ครุศาสตรบัณฑิต สาขาคอมพิวเตอร์ศึกษา');

  if (program_subjects.length > 0) {
    const program_subjectsList = CM.map(program_subject => 
      `รหัสวิชา : ${program_subject.subject_code} 
ชื่อวิชา : ${program_subject.subject_name} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    const messageText = `นี้คือวิชาหลักเบื้องต้นของสาขาคอมพิวเตอร์ศึกษาเปิดสอน:\n\n${program_subjectsList}`;

    await client.replyMessage(event.replyToken, { type: 'text', text: messageText });
    return { status: 'Success', response: messageText };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง program_subjects' });
    return { status: 'No subject Data' };
  }
}
//----------------------------------------------------------------------------------------------------------------------------- 

if (matchedIntent.intent_name === 'นวัตกรรมดิจิทัล') {
  const program_subjects = await getProgramSubjectsFromDB();
  const CM = program_subjects.filter(program_subject => program_subject.full_name && program_subject.full_name === 'เทคโนโลยีบัณฑิต สาขานวัตกรรมดิจิทัล');

  if (program_subjects.length > 0) {
    const program_subjectsList = CM.map(program_subject => 
      `รหัสวิชา : ${program_subject.subject_code} 
ชื่อวิชา : ${program_subject.subject_name} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    const messageText = `นี้คือวิชาหลักเบื้องต้นของสาขานวัตกรรมดิจิทัลเปิดสอน:\n\n${program_subjectsList}`;

    await client.replyMessage(event.replyToken, { type: 'text', text: messageText });
    return { status: 'Success', response: messageText };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง program_subjects' });
    return { status: 'No subject Data' };
  }
}
//----------------------------------------------------------------------------------------------------------------------------- 

if (matchedIntent.intent_name === 'เทคโนโลยีสารสนเทศ') {
  const program_subjects = await getProgramSubjectsFromDB();
  const CM = program_subjects.filter(program_subject => program_subject.full_name && program_subject.full_name === 'วิทยาศาสตรบัณฑิต สาขาเทคโนโลยีสารสนเทศ');

  if (program_subjects.length > 0) {
    const program_subjectsList = CM.map(program_subject => 
      `รหัสวิชา : ${program_subject.subject_code} 
ชื่อวิชา : ${program_subject.subject_name} 
─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──`   

    ).join('\n');

    const messageText = `นี้คือวิชาหลักเบื้องต้นของสาขาเทคโนโลยีสารสนเทศเปิดสอน:\n\n${program_subjectsList}`;

    await client.replyMessage(event.replyToken, { type: 'text', text: messageText });
    return { status: 'Success', response: messageText };
  } else {
    await client.replyMessage(event.replyToken, { type: 'text', text: 'ไม่พบข้อมูลในตาราง program_subjects' });
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
