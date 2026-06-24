
const Notification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }

  const notification = errorMessage.type === 'error' ? 'notif error' : 'notif'

  return (
    <div className='notification'>
      {errorMessage.message}
    </div>
  )
}

export default Notification;