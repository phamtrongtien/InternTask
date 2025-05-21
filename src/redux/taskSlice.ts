import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'completed' | 'pending';
}

const initialState: TaskState = {
  tasks: [
    { id: 'todo-1', title: 'Ly thuyet', completed: false },
    { id: 'todo-2', title: 'bai_tap2', completed: false },
  ],
  filter: 'all',
};

const taskSlice = createSlice
({
  name: 'task',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<string>) {
      const newTask: Task = {
        id: 'todo-' + (state.tasks.length + 1),
        title: action.payload,
        completed: false,
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
    },
  },
});

export const { addTask, toggleTask, deleteTask, setFilter } = taskSlice.actions;
export default taskSlice.reducer;
