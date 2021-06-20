const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const type = message.error ? 'error' : 'success'
  return (
    <div className={type}>
      {message[type]}
    </div>
  )
}

export default Notification
