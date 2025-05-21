
import React, { useState } from 'react';

const Greeting: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');

  const handleGreet = () => {
    if (name.trim() === '') {
      alert('Vui lòng nhập tên!');
      return;
    }
    setGreeting(`Xin chào, ${name}!`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Chào mừng bạn!</h1>
      
      <input
        type="text"
        placeholder="Nhập tên của bạn"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
      <button
        onClick={handleGreet}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Chào tôi
      </button>

      {greeting && (
        <p className="mt-6 text-xl text-green-600 font-semibold">{greeting}</p>
      )}
    </div>
  );
};

export default Greeting;
