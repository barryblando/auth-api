import nodemailer, { SendMailOptions } from 'nodemailer'
import config from 'config'
import log from './logger'

// async function createTestCredentials() {
//   const credentials = await nodemailer.createTestAccount()
//   console.log({ credentials })
// }
//
// createTestCredentials()

const smtp = config.get<{
  user: string,
  pass: string,
  host: string,
  port: number,
  secure: boolean
}>('smtp')

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass }
})

async function sendEmail(payload: SendMailOptions) {
  const info = await transporter.sendMail(payload)
    
  if (!info) {
    log.error(info, "Error sending email")
    return
  }

  // test purposes
  log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}

export default sendEmail
