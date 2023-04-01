const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params || {};
    try {
        const user = await User.findById(id);
        if (!user) res.status(404).send('No user found...');
        res.send(user);
    } catch (error) {
        res.status(500).send('Something went wrong...');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const loggedInUser = await User.findByCredentials(email, password);
        res.send(loggedInUser);
    } catch(e) {
        res.status(400).send(e.message);
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
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch('/:id', async(req, res) => {
    const { id } = req.params;
    const allowedUpdate = ['name', 'email', 'age', 'password'];
    const updates = Object.keys(req.body);
    const isValidOperation = allowedUpdate.some(aUpdate => updates.includes(aUpdate));

    if (!isValidOperation) {
        return res.status(400).send('Not a valid update operation...');
    }

    try {
        // const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        const user = await User.findById(id);

        updates.forEach(update => user[update] = req.body[update]);
        
        await user.save();
        console.log(user);

        if (!user) {
            return res.status(400).send({ 'error': 'No user to update...'});
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(400).send({ error: 'Invalid user to delete' });

        res.send(deletedUser);
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
});

module.exports = router;