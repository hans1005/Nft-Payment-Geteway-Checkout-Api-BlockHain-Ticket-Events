require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { createRoles } = require("./src/libs/initialSetup");
const { createCategories } = require("./src/libs/initialSetup");
const session = require("express-session");
const passport = require("passport");
const routes = require("./src/routes/index");

const cors = require("cors"); 

const verifyToken = require('./src/controllers/middlewares/verifyToken');


//INSTANCIA DE EXPRESS
const server = express();
createRoles();
createCategories();

//ESTRATEGIAS
require("./src/passport/local-auth");
require("./src/passport/google-auth");

//MIDDLEWARES

/* server.use(function(req, res, next) {
  let allowedOrigins = ['https://project-nft-s-frontend.vercel.app', 'http://localhost:3000', 'http://localhost:8001', 'https://www.henrynft.tk', 'https://henrynfts.vercel.app'];
  let origin = req.headers.origin;

  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
}); */


server.use(
  cors({
    credentials: true,
    origin:  ['https://project-nft-s-frontend.vercel.app', 'http://localhost:3000', 'http://localhost:8001', 'https://www.henrynft.tk', 'https://henrynfts.vercel.app'],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  })

); 

server.use(
  session({
    secret: "algunstringtemporalqsy",
    saveUninitialized: true,
    resave: true,
    proxy: true,
    cookie : {
      secure : true,
      maxAge: 5184000000 // 2 months
  }
  })
);
server.enable('trust proxy')
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(passport.initialize());
server.use(passport.session());
// server.use('/profile', verifyToken)

server.use("/", routes);

module.exports = server;
