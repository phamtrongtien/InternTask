import axios from "axios";

const API_BASE = 'http://localhost:3001';

interface Task {
  id:  string;
  title: string;
  completed: boolean;
}
export const getT = async (): Promise<Task[]> => {
  const res = await axios.get<Task[]>(`${API_BASE}/tasks`);
  return res.data;
}

export const deleteT = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/tasks/${id}`);
}


export const addT = async (task: { title: string }): Promise<Task> => {
    const res = await axios.post<Task>(`${API_BASE}/tasks`, task);
    return res.data;
}
