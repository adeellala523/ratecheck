/* DB — localStorage-backed store, one namespace per school: sams_<schoolId> */
const DB = {
  schoolId: null, data: null,
  key(){ return 'sams_' + this.schoolId; },
  empty(){
    return {
      meta: { name:'', logo:'', session:'', pins:{ superadmin:'9999', principal:'1234', teacher:'1111', exam:'2222' }, created: Date.now() },
      sessions: [], classes: [], sections: [], subjects: [], teachers: [], students: [],
      books: [], syllabi: [], papers: [], checkings: [], results: [],
      attendance: [], feeheads: [], feetxns: [], notices: [],
      settings: { aiKey:'', aiEndpoint:'', demoSeeded:false }
    };
  },
  init(schoolId){
    this.schoolId = schoolId;
    try {
      const raw = localStorage.getItem(this.key());
      this.data = raw ? JSON.parse(raw) : this.empty();
    } catch(e){ this.data = this.empty(); }
    // ensure all collections exist (forward-compat)
    const e = this.empty();
    for (const k of Object.keys(e)) if (this.data[k] === undefined) this.data[k] = e[k];
    return this.data;
  },
  save(){
    try { localStorage.setItem(this.key(), JSON.stringify(this.data)); return true; }
    catch(e){ return false; }
  },
  get(col){ if(!this.data[col]) this.data[col] = []; return this.data[col]; },
  getObj(col){ if(!this.data[col]) this.data[col] = {}; return this.data[col]; },
  uid(p){ return (p||'id') + '_' + Date.now().toString(36) + Math.floor(Math.random()*1e6).toString(36); },
  add(col, obj){ obj.id = obj.id || this.uid(col.slice(0,3)); obj.createdAt = Date.now(); this.get(col).push(obj); this.save(); return obj; },
  find(col, id){ return this.get(col).find(x => x.id === id); },
  update(col, id, patch){ const o = this.find(col,id); if(o){ Object.assign(o, patch); this.save(); } return o; },
  remove(col, id){ const a = this.get(col); const i = a.findIndex(x => x.id === id); if(i>=0){ a.splice(i,1); this.save(); return true; } return false; },
  meta(){ return this.data.meta; },
  settings(){ return this.getObj('settings'); },
  className(id){ const c = this.find('classes', id); return c ? c.name : '—'; },
  sectionName(id){ const s = this.find('sections', id); return s ? s.name : ''; },
  subjectName(id){ const s = this.find('subjects', id); return s ? s.name : '—'; },
  teacherName(id){ const s = this.find('teachers', id); return s ? s.name : '—'; },
  studentName(id){ const s = this.find('students', id); return s ? s.name : '—'; },
  bookTitle(id){ const b = this.find('books', id); return b ? b.bookName : '—'; },
  exportAll(){ return JSON.stringify({ app:'sams', v:1, exportedAt:new Date().toISOString(), data:this.data }); },
  importAll(json){
    const o = JSON.parse(json);
    if(!o || o.app !== 'sams' || !o.data) throw new Error('bad backup');
    this.data = o.data;
    const e = this.empty();
    for (const k of Object.keys(e)) if (this.data[k] === undefined) this.data[k] = e[k];
    this.save();
  }
};
