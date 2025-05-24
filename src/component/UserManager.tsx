import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { addUser, updateUser, deleteUser, type User } from '../redux/userSlice';
import { useTranslation } from 'react-i18next';

const UserManager: React.FC = () => {
  const users = useSelector((state: RootState) => state.user.users);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{ t('title_manager')}</h2>

      {/* Form */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder={t('name')}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
        >
          {form.id ? t('update') : t('add')}
        </button>
      </div>

      {/* Danh sách người dùng */}
      <ul className="space-y-4">
        {users.map(user => (
          <li
            key={user.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded shadow-sm"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
              >
                {t('updtate')}
              </button>
              <button
                onClick={() => dispatch(deleteUser(user.id))}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                {t('delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;
