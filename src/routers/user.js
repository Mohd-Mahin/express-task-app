const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken(); 
        res.send({ user, token });
    } catch(e) {
        res.status(400).send(e.message);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/', async (req, res) => {
    const { name, age, email, password } = req.body || {};
    try {
        const user = new User({
            name,
            age,
            email,
            password
        });
        await user.save();

        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch('/me', auth, async(req, res) => {
    const allowedUpdate = ['name', 'email', 'age', 'password'];
    const updates = Object.keys(req.body);
    const isValidOperation = allowedUpdate.some(aUpdate => updates.includes(aUpdate));

    if (!isValidOperation) {
        return res.status(400).send('Not a valid update operation...');
    }

    try {
        const user = req.user;
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send(req.user);
    } catch (error) {
        console.log(error.message);
        res.status(400).send('Something went wrong');
    }
});

module.exports = router;