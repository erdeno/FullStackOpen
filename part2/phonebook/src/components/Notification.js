const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const type = message.error ? 'error': 'success'
  return (
    <div className={type}>
      {message.message}
    </div>
  )

}

export default Notification