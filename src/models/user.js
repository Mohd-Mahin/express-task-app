const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        validate: (value) => {
            if (value < 0) throw new Error('Age Must be postive number');
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) throw new Error('Email is invalid');
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            if (value.length < 6 || value.includes('password')) throw new Error('Invalid Password');
        }  
    },
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Unable to login');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Unable to login...');
    return user;
}

// hash the plain text password before saving
userSchema.pre('save', async function(next) {
    console.log('calling pre before save');
    const user = this;
    if(user.isModified('password')) {
        const hashpass = await bcrypt.hash(user.password, 8);
        user.password = hashpass
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;