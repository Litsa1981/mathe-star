import { useState } from 'react'

function generateQuestion(klasse) {
  const ops = klasse <= 2 ? ['+', '-'] : ['+', '-', '*', '/']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a, b
  if (op === '+') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1 }
  if (op === '-') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * a) + 1 }
  if (op === '*') { a = Math.floor(Math.random() * 10) + 1; b = Math.floor(Math.random() * 10) + 1 }
  if (op === '/') { b = Math.floor(Math.random() * 10) + 1; a = b * (Math.floor(Math.random() * 10) + 1) }
  const answer = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b
  return { a, b, op, answer }
}

export default function App() {
  const [screen, setScreen] = useState('start')
  const [name, setName] = useState('')
  const [klasse, setKlasse] = useState(1)
  const [question, setQuestion] = useState(null)
  const [input, setInput] = useState('')
  const [count, setCount] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showExplain, setShowExplain] = useState(false)

  const start = () => {
    if (!name) return
    setScreen('quiz')
    setQuestion(generateQuestion(klasse))
    setCount(0)
    setCorrect(0)
    setFeedback('')
  }

  const check = () => {
    if (!input) return
    const isCorrect = parseInt(input) === question.answer
    if (isCorrect) {
      setCorrect(c => c + 1)
      setFeedback('✅ Richtig! Super!')
    } else {
      setFeedback(`❌ Nicht ganz. Die Antwort war ${question.answer}`)
    }
    setTimeout(() => {
      setFeedback('')
      setInput('')
      setShowExplain(false)
      if (count + 1 >= 10) {
        setScreen('reward')
      } else {
        setCount(c => c + 1)
        setQuestion(generateQuestion(klasse))
      }
    }, 1500)
  }

  const explain = () => setShowExplain(true)

  const opName = op => ({ '+': 'Addition', '-': 'Subtraktion', '*': 'Multiplikation', '/': 'Division' }[op])
  const opTip = (op, a, b) => {
    if (op === '+') return `${a} + ${b} bedeutet: Zähle ${a} und ${b} zusammen.`
    if (op === '-') return `${a} - ${b} bedeutet: Von ${a} nimmst du ${b} weg.`
    if (op === '*') return `${a} × ${b} bedeutet: ${a} mal die Zahl ${b} addieren.`
    if (op === '/') return `${a} ÷ ${b} bedeutet: Teile ${a} in ${b} gleiche Gruppen.`
  }

  if (screen === 'start') return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: 30, background: '#fffbe6', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 36, color: '#f59e0b' }}>⭐ Mathe Star</h1>
      <p style={{ fontSize: 18 }}>Hallo! Wie heißt du?</p>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Dein Name" style={{ fontSize: 20, padding: 10, borderRadius: 10, border: '2px solid #f59e0b', marginBottom: 20, width: '80%' }} />
      <p style={{ fontSize: 18 }}>In welche Klasse gehst du?</p>
      <div style={{ marginBottom: 20 }}>
        {[1,2,3,4].map(k => (
          <button key={k} onClick={() => setKlasse(k)} style={{ margin: 5, padding: '10px 20px', fontSize: 18, borderRadius: 10, background: klasse === k ? '#f59e0b' : '#fff', border: '2px solid #f59e0b', cursor: 'pointer' }}>{k}. Klasse</button>
        ))}
      </div>
      <button onClick={start} style={{ fontSize: 22, padding: '12px 30px', borderRadius: 15, background: '#f59e0b', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>Los geht's! 🚀</button>
    </div>
  )

  if (screen === 'quiz') return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: 30, background: '#fffbe6', minHeight: '100vh' }}>
      <h2 style={{ color: '#f59e0b' }}>Aufgabe {count + 1} von 10</h2>
      <p style={{ fontSize: 18, color: '#666' }}>Hallo {name}! Du schaffst das! 💪</p>
      {question && (
        <>
          <div style={{ fontSize: 40, margin: '20px 0', background: 'white', padding: 20, borderRadius: 20, boxShadow: '0 4px 10px #f59e0b44' }}>
            {question.a} {question.op === '*' ? '×' : question.op === '/' ? '÷' : question.op} {question.b} = ?
          </div>
          <input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Deine Antwort" style={{ fontSize: 24, padding: 10, borderRadius: 10, border: '2px solid #f59e0b', width: '40%', textAlign: 'center' }} />
          <br /><br />
          <button onClick={check} style={{ fontSize: 20, padding: '10px 25px', borderRadius: 12, background: '#f59e0b', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold', marginRight: 10 }}>Antworten ✓</button>
          <button onClick={explain} style={{ fontSize: 18, padding: '10px 20px', borderRadius: 12, background: '#fff', border: '2px solid #f59e0b', cursor: 'pointer' }}>Hilfe 💡</button>
          {showExplain && (
            <div style={{ marginTop: 20, background: '#fff', padding: 15, borderRadius: 15, border: '2px solid #f59e0b', fontSize: 18 }}>
              <b>{opName(question.op)}</b><br />{opTip(question.op, question.a, question.b)}
            </div>
          )}
          {feedback && <p style={{ fontSize: 24, marginTop: 20 }}>{feedback}</p>}
        </>
      )}
    </div>
  )

  if (screen === 'reward') return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: 30, background: '#fffbe6', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 40, color: '#f59e0b' }}>🏆 Geschafft!</h1>
      <p style={{ fontSize: 24 }}>Bravo {name}!</p>
      <p style={{ fontSize: 22 }}>Du hast {correct} von 10 Aufgaben richtig! 🌟</p>
      {correct === 10 && <p style={{ fontSize: 28 }}>🎉 Perfekt! Du bist ein echter Mathe-Star!</p>}
      {correct >= 7 && correct < 10 && <p style={{ fontSize: 24 }}>😊 Sehr gut! Weiter so!</p>}
      {correct < 7 && <p style={{ fontSize: 22 }}>💪 Nicht aufgeben! Morgen wird es besser!</p>}
      <div style={{ fontSize: 60, margin: 20 }}>{'⭐'.repeat(Math.round(correct / 2))}</div>
      <button onClick={() => setScreen('start')} style={{ fontSize: 20, padding: '12px 30px', borderRadius: 15, background: '#f59e0b', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>Nochmal spielen 🔄</button>
    </div>
  )
}
