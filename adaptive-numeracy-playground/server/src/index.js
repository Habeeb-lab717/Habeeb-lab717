// Express server for Adaptive Numeracy Playground
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// SQLite DB setup
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) throw err;
  console.log('Connected to SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS classrooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    classroom_id INTEGER,
    FOREIGN KEY(classroom_id) REFERENCES classrooms(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    question TEXT,
    correct INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);
});

// Simple classroom join/auth
app.post('/api/join', (req, res) => {
  const { code, name } = req.body;
  db.get('SELECT id FROM classrooms WHERE code = ?', [code], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) {
      db.run('INSERT INTO classrooms (code) VALUES (?)', [code], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        addStudent(this.lastID);
      });
    } else {
      addStudent(row.id);
    }
    function addStudent(classroom_id) {
      db.run('INSERT INTO students (name, classroom_id) VALUES (?, ?)', [name, classroom_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ studentId: this.lastID, classroomId: classroom_id });
      });
    }
  });
});

// Adaptive question engine (simple MVP)
function generateQuestion(level = 1) {
  // Level 1: add, Level 2: subtract, Level 3: multiply, Level 4: divide
  const a = Math.floor(Math.random() * 10 * level) + 1;
  const b = Math.floor(Math.random() * 10 * level) + 1;
  let question, answer;
  switch (level) {
    case 1:
      question = `${a} + ${b}`;
      answer = a + b;
      break;
    case 2:
      question = `${a} - ${b}`;
      answer = a - b;
      break;
    case 3:
      question = `${a} × ${b}`;
      answer = a * b;
      break;
    case 4:
      question = `${a * b} ÷ ${a}`;
      answer = b;
      break;
    default:
      question = `${a} + ${b}`;
      answer = a + b;
  }
  return { question, answer };
}

// Get next question (adapts by recent performance)
app.post('/api/next-question', (req, res) => {
  const { studentId } = req.body;
  db.all('SELECT correct FROM progress WHERE student_id = ? ORDER BY timestamp DESC LIMIT 5', [studentId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const corrects = rows.map(r => r.correct);
    let level = 1 + corrects.filter(Boolean).length;
    if (level > 4) level = 4;
    if (level < 1) level = 1;
    res.json(generateQuestion(level));
  });
});

// Submit answer
app.post('/api/submit', (req, res) => {
  const { studentId, question, answer, userAnswer } = req.body;
  const correct = Number(answer) === Number(userAnswer) ? 1 : 0;
  db.run('INSERT INTO progress (student_id, question, correct) VALUES (?, ?, ?)', [studentId, question, correct], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ correct: !!correct });
  });
});

// Teacher dashboard: get class progress
app.get('/api/class/:code/progress', (req, res) => {
  const { code } = req.params;
  db.get('SELECT id FROM classrooms WHERE code = ?', [code], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Classroom not found' });
    db.all('SELECT s.name, p.question, p.correct, p.timestamp FROM students s JOIN progress p ON s.id = p.student_id WHERE s.classroom_id = ?', [row.id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
