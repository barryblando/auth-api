import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

const dbUser = config.get('dbUser')
const dbPass = config.get('dbPass')
const dbName = config.get('dbName')
const dbHost = config.get('dbHost')

// https://stackoverflow.com/questions/40608669/what-does-authsource-means-in-mongo-database-url
// https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-connections-standard-connection-string-format
const dbUrl = `mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}?authSource=admin`

async function connectToDb() {
  try { 
    await mongoose.connect(dbUrl)
    log.info('Connected to DB')
  } catch (e) {
    process.exit(1)
  }
}

export default connectToDb
