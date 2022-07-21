import express, { NextFunction, Request, Response } from 'express'
// import cors from 'cors'
import router from './routes'
import deserializeUser from './middleware/deserializeUser'

const app = express()

app.use(express.json())

// set current user to routes that need authentication
app.use(deserializeUser)

// app.use(
//   cors({
//     origin: config.get<string>('origin'),
//     credentials: true,
//   })
// );

app.use(router)

// UnKnown Routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.status = err.status || 'ERROR'
  err.statusCode = err.statusCode || 500

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

export { app }

