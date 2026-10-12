/* Demo seed data — clearly labeled, deletable from Settings */
const Seed = {
  run(){
    const s = DB.settings();
    if (s.demoSeeded) return;
    // classes / sections / subjects
    const c5 = DB.add('classes', { name:'Class 5', demo:true });
    const secA = DB.add('sections', { classId:c5.id, name:'A', demo:true });
    const secB = DB.add('sections', { classId:c5.id, name:'B', demo:true });
    const subs = ['English','Urdu','Mathematics','Science'].map(n => DB.add('subjects', { classId:c5.id, name:n, demo:true }));
    DB.add('sessions', { name:(DB.meta().session||'2026-27'), active:true, demo:true });
    // teachers
    DB.add('teachers', { name:'Demo Teacher (English)', subjectId:subs[0].id, phone:'0300-0000000', demo:true });
    DB.add('teachers', { name:'Demo Teacher (Math)', subjectId:subs[2].id, phone:'0300-0000001', demo:true });
    // students
    const names = [['Ahmed Raza','Muhammad Raza'],['Fatima Khan','Imran Khan'],['Bilal Ahmed','Nasir Ahmed'],['Ayesha Malik','Tariq Malik'],['Usman Tariq','Tariq Mehmood'],['Zainab Ali','Ali Raza']];
    names.forEach((n,i)=>{
      DB.add('students', { rollNo:String(i+1).padStart(2,'0'), name:n[0], fatherName:n[1], classId:c5.id, sectionId:secA.id,
        gender: i%2 ? 'Female':'Male', admissionNo:'ADM-2026-0'+(i+1), dob:'2016-0'+((i%9)+1)+'-1'+(i%9),
        contact:'0300-111000'+i, status:'Active', demo:true });
    });
    // fee heads
    DB.add('feeheads', { name:'Monthly Tuition Fee', amount:1500, demo:true });
    DB.add('feeheads', { name:'Admission Fee', amount:2000, demo:true });
    // notice
    DB.add('notices', { title:'Welcome to the new session', message:'Demo notice — delete anytime from Notices.', date:new Date().toISOString().slice(0,10), audience:'all', demo:true });
    s.demoSeeded = true; DB.save();
  },
  clearDemo(){
    ['classes','sections','subjects','teachers','students','sessions','feeheads','notices'].forEach(col=>{
      DB.data[col] = DB.get(col).filter(x => !x.demo);
    });
    DB.settings().demoSeeded = false; DB.save();
  }
};
