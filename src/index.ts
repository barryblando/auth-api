require('dotenv').config()

import config from 'config'
import connectMongo from './utils/connectMongo'
import log from './utils/logger'
import { app } from './app'

const start = async () => {
  const port = config.get('port')
  
  app.listen(port, async () => {
    await connectMongo()
    
    log.info(`Server started at http://localhost:${port}`)
  })
}

start()
