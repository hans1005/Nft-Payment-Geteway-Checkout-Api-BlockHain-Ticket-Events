module.exports = function signupMail(req) {
  const { username, firstName } = req.body
  return {
    from: 'henry.nftmarket@gmail.com',
    to: username,
    subject: `Welcome to NFT Market, ${firstName}`,
    text: `Hello, ${firstName}. You have successfully registered to NFT Market. Welcome!`,
  }
}
