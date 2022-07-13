export default {
  port: 3001,
  dbUri: "mongodb://localhost:27017/auth-api",
  loglevel: "info",
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.REFRESH_PUBLIC_KEY,
  // test mail server credentials
  smtp: {
    user: 'l37cayndf2ojt2kz@ethereal.email',
    pass: '17HCqBAGZeSQhtFEhn',
    host: 'smtp.ethereal.email',
    port: 587 ,
    secure: false,
  },
}
