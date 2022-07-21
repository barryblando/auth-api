// In Express when you call the next function with an argument,
// Express assumes it’s an error so it will skip all the middleware
// functions and directly send the error to the error handler in the middleware pipe.
export default class AppError extends Error {
  status: string
  isOperational: boolean

  constructor(public message: string, public statusCode: number = 500) {
    super(message)
    this.status = `${statusCode}`.startsWith('4') ? 'FAIL' : 'ERROR'
    this.isOperational = true
    
    // https://stackoverflow.com/q/59625425/
    Error.captureStackTrace(this, this.constructor)
  }
}

