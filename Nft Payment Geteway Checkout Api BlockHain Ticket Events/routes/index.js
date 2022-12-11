const { Router } = require('express')
const Roles = require('../../src/models/Role')
const router = Router()
/* const cors = require('cors') */
const passport = require('passport')
const crypto = require('crypto')

const {
  transactionMetaMask,
} = require('../controllers/payments/crypto/transactionMetaMask')
const { StripePayment } = require('../controllers/payments/fiat/Stripe')
const { MPayment } = require('../controllers/payments/fiat/MercadoPago')
const { createOrder, getOrder } = require('../controllers/products/orders')
const {
  createProfile,
  getProfile,
  updatedProfileById,
} = require('../controllers/users/user')
const { createReview, getReview } = require('../controllers/users/review')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const verifyToken = require('../controllers/middlewares/verifyToken')
/* const corsOptions = {
  origin:
    "https://project-nft-s-frontend.vercel.app",
  credentials: true,
  optionSuccessStatus: 200,
} */

// PRUEBA NODEMAILER
const transporter = require('../libs/nodemailer')
const signupMail = require('../libs/signupMail')
const verifyAdmin = require('../controllers/middlewares/verifyAdmin')
const forgotPass = require("../libs/forgotPass");


//ADMIN
const {
  getUsers,
  updateAdminById,
  deleteUser,
  getUserById,
  getUsersDb,
} = require('../controllers/Admin/admin')
//ROUTES ADMIN

router.get('/admin/verify', verifyAdmin)
router.get('/admin/users', getUsersDb)
router.get('/user/:id', getUserById)
router.put('/admin/edit/:username', updateAdminById)
router.delete('/deleteUser/:id', deleteUser)

//CATEGORIES
const {
  createCategorie,
  updateCategorieById,
  deleteCategorieById,
  getCategories,
} = require('../controllers/products/categorie')
//ROUTES CATEGORIES
router.get('/categories', getCategories)
router.post('/create/categorie', createCategorie)
router.put('/edit/categorie/:id', updateCategorieById)
router.delete('/categorie/:id', deleteCategorieById)

//ROUTES FAVORITES
const { addFavorite } = require('../controllers/favorites/favorites')
const { getFav } = require('../controllers/favorites/getFavs')
const { deleteFav } = require('../controllers/favorites/deleteFav')
router.post('/favorites', addFavorite)
router.post('/dbfavorites', getFav)
router.post('/deleteFavorites', deleteFav)

//PRODUCTS
const {
  searchProduct,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getNFTs,
} = require('../controllers/products/products')
// const verifyAdmin = require('../controllers/middlewares/verifyAdmin')

// ROUTES PRODUCTS
router.get('/search', searchProduct)
router.get('/nfts', getNFTs)
router.get('/nft/:id', getProductById)
router.get('/orderCart', getOrder)
router.post('/nft', createProduct)
router.post('/orderCart', createOrder)
router.post('/transactionMetamask', transactionMetaMask)
router.post('/transactionStripe', StripePayment)
router.post('/MercadoPagoTransaction', MPayment)
router.put('/edit/:id', updateProductById)

//ROUTES PROFILE
router.get("/profile/:token", getProfile);
router.put("/profile/:token", updatedProfileById)
//ROUTES REVIEW
router.post("/review", createReview)
router.get("/review", getReview)


// RUTA DEL ADMIN
router.delete('/admin/:id', deleteProductById)
router.post(
  '/admin/create',
  passport.authenticate('local-signup', {
    passReqToCallback: true,
  }),
  async (req, res, next) => {
    const found = user.roles.find((e) => e == '613bd8b725b8702ce89f7474')
    res.json(req.user)
    //res.redirect(AL JOM DEL PROYECTO)
  }
)

router.delete('/delete/:id', deleteProductById)

//REGISTRO LOCAL
router.post(
  '/register',
  passport.authenticate('local-signup', {
    passReqToCallback: true,
  }),

  async (req, res, _next) => {
    const user = await User.findOne({ token: req.user.token }).populate('roles')
    res.cookie('token', user.token)
    res.cookie('role', user.roles[0].name)
    transporter.sendMail(signupMail(req), function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
        res.send('Todo ok en el envío de mails de nodemailer')
      }
    })
    return res.sendStatus(200)
  
  }
)

//INICIO DE SESION LOCAL

router.post(
  '/login',
  passport.authenticate('local-login', {
    passReqToCallback: true,
  }),
  async (req, res, next) => {
    console.log('entra')
    try {
      if (req.error || !req.user) {
        const error = new Error('new Error')
        return next(error)
      }
      req.login(req.user, { session: false }, async (err) => {
        if (err) return next(err)
        const body = { _id: req.user.id, username: req.user.username }
        const token = jwt.sign({ user: body }, 'superstringinhackeable')
        const filter = { username: req.body.username }
        const userFound = await User.findOne({
          username: req.body.username,
        }).populate('roles')
        // const userCart=await User.findOne({username:req.body.username})
        // if (req.body.cart){
        //    userCart.shoppingCart=userCart.shoppingCart.concat(req.body.cart)
        //    function onlyUnique(value, index, self) {
        //     return self.indexOf(value) === index;
        //    }
        //    let filter=userCart.shoppingCart.filter(onlyUnique )
        //    console.log(filter)
        //    userCart.shoppingCart=filter
        //    userCart.save()
        // }
        const update = { token: token }
        // const cart=userCart.shoppingCart

        const role = userFound.roles[0].name
        const resp = await User.findOneAndUpdate(filter, update, { new: true })
        console.log(resp,'respuestaaa')
        //no llegaaaa

        res.cookie('token', resp.token)
        res.cookie('role', role)
        return res.sendStatus(200)
      })
    } catch (error) {
      return next(error)
    }
  }
)

router.post('/logout', async (req, res, next) => {
  try {
    console.log(req.body)
    const filter = { token: req.body.token }
    const update = { token: null }
    await User.findOneAndUpdate(filter, update, { new: true })
    res.send('LOGGED OUT')
  } catch (error) {
    next(error)
  }
})

//INICIO DE SESION CON GOOGLE
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect:
      "http://localhost:3000/rutadeerror",
    passReqToCallback: true,
  }),
  async (req, res) => {
    const userFound = await User.findOne({
      username: req.user.username,
    }).populate('roles')
    const role = userFound.roles[0].name
    res.cookie('token', userFound.token)
    res.cookie('role', role)
    return res.redirect("http://localhost:3000")
  }
)

//PRUEBAS
router.get('/prueba', verifyAdmin)
//PASSWORD RESET
router.post('/forgot', async(req, res) => {
  const {username} = req.body;
  console.log(username)
  const user = await User.findOne({username})
  if (!user) {
    return res.status(404).send({error: 'User not found'})
  }
  const token = crypto.randomBytes(20).toString('hex');
  user.token = token;
  await user.save()
  transporter.sendMail(forgotPass(req, user), function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send("Todo ok en el envío de mails de nodemailer");
    }

  })

  return res.send(token);

})

//RESET ROUTE
router.post('/reset/:token', async(req, res)=> {
  const user = await User.findOne({token : req.params.token});
  if (!user) return res.json({message : 'token expirado'}).status(404)
  user.token = null;
  user.password = req.body.password;
  await user.save();
  return res.send('PASSWORD CAMBIADA CORRECTAMENTE')
})

/* router.use(cors(corsOptions)) */

//SHOPPING CART USER LOGGED
const { shoppingCartDB } = require('../controllers/shoppingCart/shoppingCartDB')
const { getCart } = require('../controllers/shoppingCart/getCart')
const { deleteCart } = require('../controllers/shoppingCart/deleteCart')
const { joinCart } = require('../controllers/shoppingCart/joinCart')
router.post('/userShoppingCart', shoppingCartDB)
router.post('/DBShoppingCart', getCart)
router.post('/deleteItem', deleteCart)
router.post('/joinShoppingCart', joinCart)

//PURCHAISE
const { historyPurchase } = require('../controllers/purchase/historyPurchase')
const { purchase } = require("../controllers/purchase/purchase");
const { changeStatus } = require("../controllers/purchase/changeStatus");
router.post('/purchase', historyPurchase)
router.post('/newPurchase',purchase)
router.post('/nftSold', changeStatus)

module.exports = router
