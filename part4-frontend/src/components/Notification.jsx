const Notification = ({ message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.className}>
      {message.message}
    </div>
  )
}

export default Notification