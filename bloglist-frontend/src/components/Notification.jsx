const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  const className = message.includes('error') || message.includes('Wrong')
    ? 'error-notification'
    : 'notification'

  return <div className={className}>{message}</div>

}

export default Notification