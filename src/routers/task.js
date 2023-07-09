const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { default: mongoose } = require('mongoose');
const router = new express.Router();

// get all tasks
router.get('/', auth, async (req, res) => {
    const { _id } = req.user;
    try {
        // const task = await Task.find({ author: _id });
        await req.user.populate('tasks');
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send('Something went wrong...');
    }
});

// find task by id
router.get('/:id', auth, async (req, res) => {
    const { id } = req.params || {};
    const { _id: userId } = req.user;
    try {
        const task = await Task.findOne({ 
            _id: id, 
            author: userId
        });
        if (!task) res.status(404).send('No Task Found...');

        res.send(task);
    } catch (error) {
        res.status(500).send('Something went wrong...');
    }
});

// create a new task
router.post('/', auth, async (req, res) => {
    const { description, completed } = req.body || {};
    console.log(req.user._id);
    try {
        const task = new Task({
            description,
            completed,
            author: req.user._id
        });
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

// update a task
router.patch('/:id', auth, async (req, res) => {
    const { params, body } = req;
    const { id } = params;
    const updates = Object.keys(body);
    const allowedUpdate = ['description', 'completed'];

    const isValidUpdate = allowedUpdate.some(aUpdate => updates.includes(aUpdate));

    if (!isValidUpdate) return res.status(400).send({ error: 'Not a valid update'});

    try {
        const task = await Task.findOne({ _id: id, author: req.user._id });
        if (!task) return res.status(400).send({ error: 'No Task found to update...'});
        updates.forEach(update => task[update] = body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete a task
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id, author: req.user._id });
        if (!deletedTask) return res.status(400).send({ error: 'Not a valid task to delete' });
        res.send(deletedTask);
    } catch (error) {
        res.status(400).send('Something went wrong...');
    }
})


module.exports = router;