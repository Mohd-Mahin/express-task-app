const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Task = require("./task");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      default: 0,
      validate: (value) => {
        if (value < 0) throw new Error("Age Must be postive number");
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) throw new Error("Email is invalid");
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: (value) => {
        if (value.length < 6 || value.toLowerCase().includes("password"))
          throw new Error("Invalid Password");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

// mapping => localField(User) => ForeignField(Task|author) || Current Schema localField should match other field key. (User._id == Task.author)
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "author",
});

// Instance Methods - Method [1]
userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.tokens;
  delete userObject.password;

  return userObject;
};

// Instance Methods - Method [2]
/* when JSON.stringify method is called, toJSON() method is also called
const obj = {
    name: 'mahin',
    age: 30,
    gender: 'male',
    speak() {
        console.log(this.name, 'name');  
    },
    toJSON() {
        return {
            name: this.name,
            age: this.age
        }
    }
  }
*/
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.tokens;
  delete userObj.password;
  delete userObj.avatar;

  return userObj;
};

// Instance Methods
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// static method also known as Model Methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login...");
  return user;
};

// hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  console.log("working...pre-save");
  if (user.isModified("password")) {
    const hashpass = await bcrypt.hash(user.password, 8);
    user.password = hashpass;
  }
  next();
});

// middleware for deleting tasks with user
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const author = this._id;
    await Task.deleteMany({
      author,
    });
    next();
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
