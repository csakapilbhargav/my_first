import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        userId: req.user.id
    });

    await task.save();
    res.send(task);
});

router.get("/", auth, async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

router.delete("/:id", auth, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});

export default router;