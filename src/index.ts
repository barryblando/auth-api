require('dotenv').config()

import config from 'config'
import connectMongo from './utils/connectMongo'
import log from './utils/logger'
import { app } from './app'
import { startMetricServer } from './utils/metrics'

const start = async () => {
  const port = config.get('port')
  
  app.listen(port, async () => {
    await connectMongo()
    
    startMetricServer()
    
    log.info(`Server started at http://localhost:${port}`)
  })
}

start()
