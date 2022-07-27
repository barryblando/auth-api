import express, { NextFunction, Request, Response } from 'express'
// import cors from 'cors'
import responseTime from 'response-time'
import router from './routes'
import config from 'config'
import deserializeUser from './middleware/deserializeUser'
import { swaggerDocs } from './utils/swagger'
import { restResponseTimeHistogram } from './utils/metrics'

const app = express()

const port = config.get('port') as number

app.use(express.json())

// set current user to routes that need authentication
app.use(deserializeUser)

// app.use(
//   cors({
//     origin: config.get<string>('origin'),
//     credentials: true,
//   })
// );

// Metrics - order matters. This middleware must receive incoming request first and record for response time
app.use(responseTime((req: Request, res: Response, time: number) => {
  if (req?.route?.path) {
    restResponseTimeHistogram.observe({
      method: req.method,
      route: req.route.path,
      status_code: res.statusCode,
    }, time * 1000)
  }
}))

app.use(router)

// Swagger Docs
swaggerDocs(app, port)

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

