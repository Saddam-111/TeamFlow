import { create } from 'zustand';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  
  setTasks: (tasks) => set({ tasks }),
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (taskId, updates) => set((state) => ({ 
    tasks: state.tasks.map(t => t._id === taskId ? { ...t, ...updates } : t) 
  })),
  
  removeTask: (taskId) => set((state) => ({ 
    tasks: state.tasks.filter(t => t._id !== taskId) 
  })),
  
  reorderTasks: (status, orderedIds) => set((state) => {
    const reorderedTasks = [...state.tasks];
    orderedIds.forEach((id, index) => {
      const task = reorderedTasks.find(t => t._id === id);
      if (task) {
        task.status = status;
        task.order = index;
      }
    });
    return { tasks: reorderedTasks };
  }),
  
  getTasksByStatus: (status) => {
    const { tasks } = get();
    return tasks
      .filter(t => t.status === status)
      .sort((a, b) => a.order - b.order);
  }
}));
