
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Greeting: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng:'en'|'vn') => {
        i18n.changeLanguage(lng);
    }
  const handleGreet = () => {
    if (name.trim() === '') {
      alert(t('alert'))
      return;
    }
    setGreeting(`Xin chào, ${name}!`);
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
          <button onClick={()=>changeLanguage('vn')}>
              Tiếng việt
          </button>
          <button onClick={()=>changeLanguage('en')}>
              English
        </button>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">{ t('welcome')}</h1>
      
      <input
        type="text"
        placeholder={t('add_name')}
        value={name}
        onChange={e => setName(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
      <button
        onClick={handleGreet}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {t('hi_me')}
      </button>

      {greeting && (
        <p className="mt-6 text-xl text-green-600 font-semibold">{greeting}</p>
      )}
    </div>
  );
};

export default Greeting;
