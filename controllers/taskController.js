import Task from "../models/Tasks.js";
import redisClient from "../config/redis.js";
import logger from "../middlewares/logger.js";
import * as taskService from "../services/taskService.js";

// get the tasks with caching
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(
      `Error getting tasks for user ${req.user.id}: ${error.message}`
    );
    res.status(500).json({ message: "Error getting tasks" });
  }
};

// add a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, recurrence } = req.body;
    if (!title) {
      return res.status(400).json({ message: "The title is required" });
    }
    const newTask = await taskService.createTask(
      req.user.id,
      title,
      description,
      recurrence
    );
    res.status(201).json(newTask);
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`);
    res.status(500).json({ message: "Error creating task" });
  }
};

// update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTask(req.user.id, id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ message: "task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    logger.error(`Error updating task: ${error.message}`);
    res.status(500).json({ message: "Error updating task" });
  }
};

// delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await taskService.deleteTask(req.user.id, id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting task: ${error.message}`);
    res.status(500).json({ message: "Error deleting task" });
  }
};

// share a task
export const shareTaskController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userIdToShareWith } = req.body; // userID to share

    const task = await taskService.shareTask(taskId, req.user.id, userIdToShareWith);

    res.status(200).json({ message: "Task shared successfully", task });
  } catch (error) {
    logger.error(`Error sharing task: ${error.message}`);
    res.status(500).json({ message: "Error sharing task" });
  }
};
