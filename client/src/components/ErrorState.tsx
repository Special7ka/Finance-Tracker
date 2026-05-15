const ErrorState = ({ message }: { message: string }) => {
  return (
    <div>
      <p>Error: {message}</p>
    </div>
  )
}

export default ErrorState
