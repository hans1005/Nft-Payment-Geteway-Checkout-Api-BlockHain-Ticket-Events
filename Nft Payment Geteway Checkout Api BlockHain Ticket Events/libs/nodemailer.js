const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'henry.nftmarket@gmail.com',
    pass: 'Henry_NFT',
  },
})

module.exports = transporter
