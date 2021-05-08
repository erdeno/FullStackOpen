import React, { useState } from 'react'


const Header = ({ text }) => (<h1>{text}</h1>)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statistic = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad, total }) => {
  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  } else {
    return (
      <table>
        <tbody>
          <Statistic text={'good'} value={good} />
          <Statistic text={'neutral'} value={neutral} />
          <Statistic text={'bad'} value={bad} />
          <Statistic text={'all'} value={total} />
          <Statistic text={'average'} value={((good * 1) + (neutral * 0) + (bad * -1)) / (total)} />
          <Statistic text={'positive'} value={(good / (total) * 100) + ' %'} />
        </tbody>
      </table>
    )
  }
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClick = (param) => {
    if (param === 'good') {
      return () => {
        setGood(good + 1)
      }
    } else if (param === 'neutral') {
      return () => {
        setNeutral(neutral + 1)
      }
    } else if (param === 'bad') {
      return () => {
        setBad(bad + 1)
      }
    }


  }
  const total = good + neutral + bad

  return (
    <div>
      <Header text={'give feedback'} />
      <Button handleClick={handleClick('good')} text='good' />
      <Button handleClick={handleClick('neutral')} text='neutral' />
      <Button handleClick={handleClick('bad')} text='bad' />
      <Header text={'statistics'} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
      />
    </div>
  )
}

export default App