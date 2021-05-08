import React, { useState } from 'react'

const Header = ({ text }) => (<h1>{text}</h1>)
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Anecdote = ({ item }) => (<p>{item}</p>)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(6 + 1).join('0').split('').map(parseFloat))



  const handleClick = (param) => {
    if (param === 'anecdote') {
      return () => {
        const num = Math.floor(Math.random() * 6)
        setSelected(num)
      }
    } else if (param === 'vote') {
      return () => {
        const copy = [...points]
        copy[selected] += 1
        setPoints(copy)
      }
    }
  }

  const max = Math.max(...points);

  return (
    <div>
      <Header text={'Anecdote of the day'} />
      <Anecdote item={anecdotes[selected]} />
      <p>has {points[selected]} votes</p>
      <Button text='vote' handleClick={handleClick('vote')} />
      <Button text='next anecdote' handleClick={handleClick('anecdote')} />
      <Header text={'Anecdote with most votes'} />
      <Anecdote item={anecdotes[points.indexOf(max)]} />


    </div>
  )
}

export default App