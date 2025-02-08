import mongoose from "mongoose";

// Task model
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recurrence: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"],
    default: "none",
  },
  nextOccurrence: { type: Date, default: null },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;
