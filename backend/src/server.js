import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { businesses, students, tasks } from './data.js';
import { analyseProblem } from './matcher.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storePath = path.join(__dirname, '../data/store.json');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function readStore() {
  if (!fs.existsSync(storePath)) return { applications: [], postedProblems: [] };
  return JSON.parse(fs.readFileSync(storePath, 'utf8'));
}
function writeStore(store) {
  fs.mkdirSync(path.dirname(storePath), { recursive:true });
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}
function rupees(value) { return `₹${Number(value).toLocaleString('en-IN')}`; }

app.get('/api/health', (_req,res) => res.json({status:'ok', service:'skillbridge-api', version:'1.0.0'}));
app.get('/api/students', (req,res) => {
  const query = (req.query.q || '').toLowerCase();
  const skill = (req.query.skill || '').toLowerCase();
  const results = students.filter(s => !query || `${s.name} ${s.role} ${s.city} ${s.skills.join(' ')}`.toLowerCase().includes(query))
    .filter(s => !skill || s.skills.some(x => x.toLowerCase().includes(skill)));
  res.json({data:results, total:results.length});
});
app.get('/api/students/:id', (req,res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({error:'Student not found'});
  res.json({data:student});
});
app.get('/api/tasks', (req,res) => {
  const query=(req.query.q || '').toLowerCase(), category=(req.query.category || '').toLowerCase();
  const results=tasks.filter(t => !query || `${t.title} ${t.description} ${t.skills.join(' ')}`.toLowerCase().includes(query))
    .filter(t => !category || t.category.toLowerCase() === category);
  res.json({data:results.map(t=>({...t,budgetLabel:rupees(t.budget)})), total:results.length});
});
app.get('/api/tasks/:id', (req,res) => {
  const task=tasks.find(t=>t.id===req.params.id);
  if (!task) return res.status(404).json({error:'Task not found'});
  res.json({data:{...task,budgetLabel:rupees(task.budget)}});
});
app.get('/api/businesses', (_req,res) => res.json({data:businesses,total:businesses.length}));
app.post('/api/matches', (req,res) => {
  const {title,description,category,skills} = req.body;
  if (!title && !description) return res.status(400).json({error:'Provide a title or description to analyse.'});
  res.json({data:analyseProblem({title,description,category,skills}, students)});
});
app.post('/api/problems', (req,res) => {
  const {title,description,ownerType,budget,deadline,category,skills=[]} = req.body;
  if (!title || !description || !ownerType) return res.status(400).json({error:'title, description and ownerType are required.'});
  const store=readStore();
  const problem={id:`problem_${Date.now()}`,title,description,ownerType,budget,deadline,category,skills,createdAt:new Date().toISOString()};
  store.postedProblems.unshift(problem); writeStore(store);
  res.status(201).json({data:problem, analysis:analyseProblem(problem, students)});
});
app.get('/api/applications', (_req,res) => res.json({data:readStore().applications}));
app.post('/api/applications', (req,res) => {
  const {taskId,studentId='aarav',note=''}=req.body;
  const task=tasks.find(t=>t.id===taskId), student=students.find(s=>s.id===studentId);
  if (!task || !student) return res.status(400).json({error:'A valid taskId and studentId are required.'});
  const store=readStore();
  if (store.applications.some(x=>x.taskId===taskId&&x.studentId===studentId)) return res.status(409).json({error:'This student has already applied to the task.'});
  const application={id:`application_${Date.now()}`,taskId,studentId,note,status:'Submitted',createdAt:new Date().toISOString()};
  store.applications.unshift(application);writeStore(store);
  res.status(201).json({data:application});
});
app.use((_req,res) => res.status(404).json({error:'Route not found'}));
app.listen(port, () => console.log(`SkillBridge API running at http://localhost:${port}`));
