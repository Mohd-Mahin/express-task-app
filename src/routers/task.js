const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.get('/', async (req, res) => {
    try {
        const task = await Task.find({ });
        if (!task.length) res.status(404).send('No Task Found...');
 
        res.send(task);
    } catch (error) {
        res.status(500).send('Something went wrong...');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params || {};
    try {
        const task = await Task.findById(id);
        if (!task) res.status(404).send('No Task Found...');

        res.send(task);
    } catch (error) {
        res.status(500).send('Something went wrong...');
    }
});



router.post('/', async (req, res) => {
    const { description, completed } = req.body || {};
    try {
        const task = new Task({
            description,
            completed
        });
        await task.save();
        res.status(201).send('New Task created');
    } catch (err) {
        res.status(500).send(err);
    }
});


router.patch('/:id', async (req, res) => {
    const { params, body } = req;
    const { id } = params;
    const updates = Object.keys(body);
    const allowedUpdate = ['description', 'completed'];

    const isValidUpdate = allowedUpdate.some(aUpdate => updates.includes(aUpdate));

    if (!isValidUpdate) return res.status(400).send({ error: 'Not a valid update'});

    try {
        // const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        const task = await Task.findById(id);

        updates.forEach(update => task[update] = body[update]);

        await task.save();

        if (!task) return res.status(400).send({ error: 'No user found to update...'});
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) return res.status(400).send({ error: 'Not a valid task to delete' });

        res.send(deletedTask);
    } catch (error) {
        res.status(400).send('Something went wrong...');
    }
})


module.exports = router;