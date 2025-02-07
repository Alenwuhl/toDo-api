import Task from '../models/Tasks.js';

// get the tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); 
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'error getting tasks' });
  }
};

// add a new task
export const createTask = async (req, res) => {
    try {
      console.log("Data recived:", req.body);  
  
      const { title, description } = req.body;
  
      if (!title) {
        return res.status(400).json({ message: 'The tittle is required' });
      }
  
      const newTask = new Task({
        title,
        description,
      });
  
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      console.error("error creating the task:", error.message); 
      res.status(500).json({ message: 'error creating the task ', error: error.message });
    }
  };
  

// update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'error updating task' });
  }
};

// delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'task eliminated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};
