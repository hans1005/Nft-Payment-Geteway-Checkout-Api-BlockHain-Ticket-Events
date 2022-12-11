const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: {
    type: String,
  },
  address:String,
  firstName: String,
  lastName: String,
  token: String,
  password: {
    type: String,
  },
  googleID: String,
  profilePic: String,
  artist: String,
  description: String,
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Roles",
    },
    { timestamps: true, versionKey: false },
  ],
  shoppingCart: [
    {
      type: Schema.Types.ObjectId,
      ref: "ShoppingCart",
    },
    { timestamps: true, versionKey: false },
  ],
  favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "favourites",
    },
    { timestamps: true, versionKey: false },
  ],
  purchase: [
    {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
    },
    { timestamps: true, versionKey: false },
  ],
});

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model("users", userSchema);