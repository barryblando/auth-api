// Faking sendMail implementation
export const sendMail = () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn((mailOptions, callback) => callback())
  })
})
