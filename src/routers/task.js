const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const router = new express.Router();

// get all tasks
// Filtering -> GET /tasks?completed=true
// Pagination -> GET/tasks?timit=10&skip=0 (first page) limit=10&skip=10 (second page) limit=10&skip=20(third page)
// Sorting -> GET/tasks?sortBy=createdAt:desc(descending order -> -1) | createdAt:asc(ascending -> 1)
router.get("/", auth, async (req, res) => {
  const { _id } = req.user;
  const { completed, limit, skip, sortBy } = req.query;

  const match = {};
  let sort = {};
  if (completed) {
    match["completed"] = completed === "true" ? true : false;
  }

  if (sortBy) {
    const [field, sortOrder] = sortBy.split(":");
    sort[field] = sortOrder === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      options: {
        sort,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
      match,
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send("Something went wrong...");
  }
});

// find task by id
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params || {};
  const { _id: userId } = req.user;
  try {
    const task = await Task.findOne({
      _id: id,
      author: userId,
    });
    if (!task) res.status(404).send("No Task Found...");

    res.send(task);
  } catch (error) {
    res.status(500).send("Something went wrong...");
  }
});

// create a new task
router.post("/", auth, async (req, res) => {
  const { description, completed } = req.body || {};
  console.log(req.user._id);
  try {
    const task = new Task({
      description,
      completed,
      author: req.user._id,
    });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update a task
router.patch("/:id", auth, async (req, res) => {
  const { params, body } = req;
  const { id } = params;
  const updates = Object.keys(body);
  const allowedUpdate = ["description", "completed"];

  const isValidUpdate = allowedUpdate.some((aUpdate) =>
    updates.includes(aUpdate)
  );

  if (!isValidUpdate)
    return res.status(400).send({ error: "Not a valid update" });

  try {
    const task = await Task.findOne({ _id: id, author: req.user._id });
    if (!task)
      return res.status(400).send({ error: "No Task found to update..." });
    updates.forEach((update) => (task[update] = body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// delete a task
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      author: req.user._id,
    });
    if (!deletedTask)
      return res.status(400).send({ error: "Not a valid task to delete" });
    res.send(deletedTask);
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

module.exports = router;
