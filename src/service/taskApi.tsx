import axios from "axios";

const API_BASE = 'http://localhost:3001';

interface Task {
  id:  string;
  title: string;
  completed: boolean;
  attachmentUrl: string[]; // thêm field mới

}
export const getT = async (): Promise<Task[]> => {
  const res = await fetch('http://localhost:3000/tasks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to add task: ${res.statusText}`);
  }

  return await res.json(); // trả về task vừa thêm, có id từ DB
}

export const deleteT = async (id: string) => {
  const response = await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return response.json();
};


export const addT = async (task: { title: string }): Promise<Task> => {
    const res = await axios.post<Task>(`${API_BASE}/tasks`, task);
    return res.data;
}

export async function addTaskApi(task: { title: string; completed: boolean; attachmentUrl: string[] }) {
  const res = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    throw new Error(`Failed to add task: ${res.statusText}`);
  }

  return await res.json(); // trả về task vừa thêm, có id từ DB
}
