module.exports = function forgotPass(req, user) {

    const { username } = req.body
    return {
      from: 'henry.nftmarket@gmail.com',
      to: username,
      subject: `Password Reset Request`,
      text: `Hello, ${user.firstName}. We've received a password reset request from this email address. Below we'll provide you a special link that will help you change your password. Please note that for security reasons this link will expire after 24 hours. http://localhost:3000/reset/${user.token}`,
    }
  }
  