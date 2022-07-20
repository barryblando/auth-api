require('dotenv').config()

import config from 'config'
import connectToDb from './utils/connectToDb'
import log from './utils/logger'
import { app } from './app'

const start = async () => {
  try {
    await connectToDb()
  } catch (err) {
    console.log(err)
  }

  const port = config.get('port')

  app.listen(port, () => {
    log.info(`Server started at http://localhost:${port}`)
  })
}

start()
