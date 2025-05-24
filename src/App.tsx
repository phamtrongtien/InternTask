import './App.css';
import Greeting from './component/Greeting';
import Task1 from './daily-task/Task1';
import Task2 from './daily-task/Task2';
import UserManager from './component/UserManager';
import { Route, Routes, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import SharePointLogin from './component/SharePointComponent';
import Home from './component/Home';
import Task3 from './daily-task/Task3';



function App(): React.ReactElement {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'en' | 'vn') => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <nav className="flex justify-between items-center mb-6 p-4 bg-white rounded shadow">
        <div className="space-x-4">
          <Link to="/task1" className="text-blue-600 hover:underline">Task1</Link>
          <Link to="/task2" className="text-blue-600 hover:underline">Task2</Link>
          <Link to="/Task3" className="text-blue-600 hover:underline">Task3</Link>

          <Link to="/greeting" className="text-blue-600 hover:underline">Greeting</Link>
          <Link to="/userManager" className="text-blue-600 hover:underline">UserManager</Link>
          {/* <Link to="/sp" className="text-blue-600 hover:underline">Sp</Link> */}
          <Link to="/home" className="text-blue-600 hover:underline">Home</Link>



        </div>

        <div className="space-x-2">
          <button
            onClick={() => changeLanguage('vn')}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Tiếng Việt
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            English
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/task1" element={<Task1 />} />
        <Route path="/task2" element={<Task2 />} />
        <Route path="/greeting" element={<Greeting />} />
        <Route path="/userManager" element={<UserManager />} />
        {/* <Route path='/sp' element={<SharePointLogin />} /> */}
        <Route path='/home' element={<Home />} />
        <Route path='/task3' element={<Task3/>}/>
      </Routes>
    </div>
  );
}

export default App;