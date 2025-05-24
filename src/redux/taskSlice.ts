import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string; 
  title: string;
  completed: boolean;
  attachmentUrl: string; // thêm field mới
}

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'completed' | 'pending';
}

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload.map(task => ({
        ...task,
        attachmentUrl: task.attachmentUrl ?? "",
      }));
    },
    addTask(state, action: PayloadAction<Task>) {
      const newTask = {
        ...action.payload,
        attachmentUrl: action.payload.attachmentUrl ?? "",
      };
      state.tasks.push(newTask);
    },    
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    setFilter(state, action: PayloadAction<'all' | 'completed' | 'pending'>) {
      state.filter = action.payload;
    }
  }
});

export const { setTasks, addTask, toggleTask, deleteTask, setFilter } = taskSlice.actions;
export default taskSlice.reducer;
