import Task from "../models/Tasks.js";
import redisClient from "../config/redis.js";
import logger from "../middlewares/logger.js";
import { calculateNextOccurrence } from "../utils/taskUtils.js";

// get the tasks with caching
export const getTasks = async (userId) => {
  try {
    const cacheKey = `tasks:${userId}`;

    // check if the tasks are in rdeis
    const cachedTasks = await redisClient.get(cacheKey);
    if (cachedTasks) {
      logger.info(`Cache hit for user ${userId}`);
      return JSON.parse(cachedTasks); 
    }

    // if not in redis, get them from MongoDB
    logger.info(`Cache miss for user ${userId}, fetching from MongoDB.`);
    const tasks = await Task.find({
      $or: [
        { user: userId },               
        { sharedWith: userId },          
      ]
    });

    if (tasks.length > 0) {
      logger.info(`Storing tasks in Redis for user ${userId}`);
      await redisClient.setEx(cacheKey, 600, JSON.stringify(tasks)); // save the tasks in redis
    }

    return tasks; 
  } catch (error) {
    logger.error(`Error getting tasks for user ${userId}: ${error.message}`);
    throw new Error("Error getting tasks");
  }
};

// add a new task
export const createTask = async (userId, title, description, recurrence) => {
  try {
    let nextOccurrence = null;

    // calculate the next occurrence if the task have this property
    if (recurrence !== "none") {
      nextOccurrence = calculateNextOccurrence(recurrence);
      logger.debug(`Next occurrence for ${recurrence}: ${nextOccurrence}`);
    }

    const newTask = new Task({
      title,
      description,
      user: userId,
      recurrence,
      nextOccurrence,
    });
    logger.debug(`Creating task for user ${userId}: ${newTask}`);
    await newTask.save();

    await redisClient.del(`tasks:${userId}`);
    logger.info(`Task created successfully for user ${userId}`);

    return newTask;
  } catch (error) {
    logger.error(`Error creating task for user ${userId}: ${error.message}`);
    throw error;
  }
};

// update a task
export const updateTask = async (userId, taskId, taskData) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
    });
    if (!updatedTask) {
      logger.warn(`Task not found for user ${userId}`);
      return null;
    }
    await redisClient.del(`tasks:${userId}`);
    logger.info(`Task ${taskId} updated successfully for user ${userId}`);
    return updatedTask;
  } catch (error) {
    logger.error(
      `Error updating task ${taskId} for user ${userId}: ${error.message}`
    );
    throw error;
  }
};

// delete a task
export const deleteTask = async (userId, taskId) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      logger.warn(`Task not found for user ${userId}`);
      return null;
    }
    await redisClient.del(`tasks:${userId}`);
    logger.info(`Task ${taskId} deleted successfully for user ${userId}`);
    return deletedTask;
  } catch (error) {
    logger.error(
      `Error deleting task ${taskId} for user ${userId}: ${error.message}`
    );
    throw error;
  }
};

// share a task with another user
export const shareTask = async (taskId, userId, userIdToShareWith) => {
  try {
    // check if the task exists
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // check if the user is the owner of the task
    if (task.user.toString() !== userId) {
      logger.error(`User ${userId} is not the owner of the task ${taskId}. He can't share it.`);
      throw new Error("You are not the owner of this task");
    }

    // check if is already shared
    if (task.sharedWith.includes(userIdToShareWith)) {
      logger.warn(`Task ${taskId} already shared with user ${userIdToShareWith}`);
      throw new Error("Task already shared with this user");
    }

    // add the user to the sharedWith array
    task.sharedWith.push(userIdToShareWith);
    await task.save();  

    logger.info(`Task ${taskId} shared with user ${userIdToShareWith}`);
    return task;
  } catch (error) {
    logger.error(`Error sharing task: ${error.message}`);
    throw new Error("Error sharing task");
  }
};