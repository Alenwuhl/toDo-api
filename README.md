# Task Management API Documentation

## Getting Started

This project must be downloaded and requires both the **Node.js server** and the **Redis server** to be started.

It is important that when testing this backend, you first register and log in, retrieve the token from the login, and use it for all routes requiring a specific user, as not every user has permission to manipulate any task.
I have included a JSON file with the POSTMAN test examples in this project to make it easier to test the project. However, you should pay attention and change the ids and tokens.

---

## Project Structure

### Routes
- **authRoutes.js** - Handles routes for user registration and login.
- **taskRoutes.js** - Manages routes for:
  - Fetching all tasks for a user
  - Creating a new task
  - Updating a task
  - Deleting a task
  - Sharing a task

### Models
- **Users.js** - Defines the user model.
- **Tasks.js** - Defines the task model.

### Controllers
- **authController.js** - Called by `authRoutes.js` and connects to `authServices.js`.
- **taskController.js** - Called by `taskRoutes.js` and connects to `taskServices.js`.

### Config
- **db.js** - Connects to MongoDB.
- **redis.js** - Connects to Redis.

### Jobs
- **taskScheduler.js** - Manages tasks with daily, weekly, or monthly recurrence.

### Middlewares
- **authMiddleware.js** - Verifies JWT tokens for routes requiring user authentication.
- **logger.js** - Uses Winston to create a logging system for the entire application.
- **rateLimiter.js** - Implements rate limiting to restrict the number of requests per IP.

### Utils
- **hashPassword.js** - Contains functions for hashing and comparing passwords.
- **tasksUtils.js** - Calculates the next occurrence of a recurring task.

---
