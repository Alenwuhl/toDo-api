import cron from "node-cron";
import Task from "../models/Tasks.js";
import logger from "../middlewares/logger.js";
import { createTask } from "../services/taskService.js";
import { calculateNextOccurrence } from "../utils/taskUtils.js";

export const runTaskScheduler = async () => {
  logger.info("Running scheduled task job for recurrent tasks.");

  const now = new Date();

  try {
    const tasks = await Task.find({ nextOccurrence: { $lte: now } });

    if (tasks.length === 0) {
      logger.info("No recurrent tasks to process.");
      return;
    }

    for (let task of tasks) {
      logger.info(`Processing recurrent task: ${task.title} for user ${task.user}`);

      // create the task
      await createTask(task.user, task.title, task.description, task.recurrence);

      // update the next occurrence
      task.nextOccurrence = calculateNextOccurrence(task.recurrence);
      await task.save();
    }

    logger.info("Scheduled task job completed successfully.");
  } catch (error) {
    logger.error(`Error processing recurrent tasks: ${error.message}`);
  }
};

// Run the task scheduler every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    logger.info("Running scheduled task job.");
    await runTaskScheduler();
  } catch (error) {
    logger.error(`Cron job execution failed: ${error.message}`);
  }
});
