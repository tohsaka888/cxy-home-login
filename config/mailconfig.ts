import nodemailer from 'nodemailer'

const mailconfig = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secure: true,
  auth: {
    user: 'tohsaka888@qq.com',
    pass: process.env.mailPass
  }
})

export default mailconfig