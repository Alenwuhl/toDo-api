//to calculate the next occurrence of a task
export const calculateNextOccurrence = (recurrence) => {
    const now = new Date();
    
    if (recurrence === "daily") {
      return new Date(now.setDate(now.getDate() + 1));
    }
    if (recurrence === "weekly") {
      return new Date(now.setDate(now.getDate() + 7));
    }
    if (recurrence === "monthly") {
      return new Date(now.setMonth(now.getMonth() + 1));
    }
    
    return null;
  };
  