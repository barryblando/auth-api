import express from 'express'
import client from 'prom-client'
import log from './logger'

// Don't expose metric server, impmplement it's own port
const app = express()

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code']
})

export const databaseResponseTimeHistogram = new client.Histogram({
  name:'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success']
})

export function startMetricServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics
  
  collectDefaultMetrics()
  
  app.get('/metrics', async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType)
    
    // send gathered metrics
    return res.send(await client.register.metrics())
  })
  
  app.listen(9100, () => {
    log.info('Metrics server started at http://localhost:9100')
  })
}
