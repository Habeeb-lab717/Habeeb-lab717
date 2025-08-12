import React, { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [step, setStep] = useState('join');
  const [classCode, setClassCode] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [classroomId, setClassroomId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const joinClass = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: classCode, name })
    });
    const data = await res.json();
    setStudentId(data.studentId);
    setClassroomId(data.classroomId);
    setStep('question');
    setLoading(false);
    nextQuestion(data.studentId);
  };

  const nextQuestion = async (id = studentId) => {
    setLoading(true);
    setFeedback('');
    setUserAnswer('');
    const res = await fetch(`${API}/api/next-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: id })
    });
    const data = await res.json();
    setQuestion(data);
    setLoading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        question: question.question,
        answer: question.answer,
        userAnswer
      })
    });
    const data = await res.json();
    setFeedback(data.correct ? '✅ Correct!' : '❌ Try again!');
    setLoading(false);
    if (data.correct) setTimeout(() => nextQuestion(), 1000);
  };

  if (step === 'join') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
        <div className="bg-white p-8 rounded shadow w-80">
          <h1 className="text-2xl font-bold mb-4">Join Classroom</h1>
          <input className="border p-2 w-full mb-2" placeholder="Class Code" value={classCode} onChange={e => setClassCode(e.target.value)} />
          <input className="border p-2 w-full mb-4" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={joinClass} disabled={loading}>
            {loading ? 'Joining...' : 'Join'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'question' && question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded shadow w-96">
          <h2 className="text-xl font-bold mb-4">Solve:</h2>
          <div className="text-3xl mb-4">{question.question}</div>
          <form onSubmit={submit}>
            <input className="border p-2 w-full mb-4 text-xl" type="number" placeholder="Your Answer" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} required />
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Submit'}
            </button>
          </form>
          {feedback && <div className="mt-4 text-lg">{feedback}</div>}
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;
