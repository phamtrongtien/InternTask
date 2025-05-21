// src/components/UserManager.tsx
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { addUser, updateUser, deleteUser, type User } from '../redux/userSlice';

const UserManager: React.FC = () => {
  const users = useSelector((state: RootState) => state.user.users);
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState<User>({
    id: '',
    name: '',
    email: '',
  });

  const idCounter = useRef(1); 

  const handleSubmit = () => {
    if (!form.name || !form.email) return;

    if (form.id) {
      dispatch(updateUser(form));
    } else {
      const newId = `user-${idCounter.current++}`;
      dispatch(addUser({ ...form, id: newId }));
    }

    setForm({ id: '', name: '', email: '' });
  };

  const handleEdit = (user: User) => {
    setForm(user);
  };

  return (
    <div className="flex justify-center items-center h-screen mt-4 p-4">
      <h2 className="mb-4">Quản lý tài khoản</h2>

      <div >
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
         
        />
        <button
          onClick={handleSubmit}
         
        >
          {form.id ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>

      <ul>
        {users.map(user => (
          <li key={user.id} >
            <div>
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(user)}
              >
                Sửa
              </button>
              <button
                onClick={() => dispatch(deleteUser(user.id))}
              >
                Xoá
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
