import './App.css'
import Greeting from './daily-task/Greeting';
import Task1 from './daily-task/Task1'
import Task2 from './daily-task/Task2';
import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import UserManager from './daily-task/UserManager';

function App(): React.ReactElement {

  return (

 
      <div className="card">
      <nav>
        <Link to='/task1'>Task1</Link>      |
        <Link to='/task2'>Task2</Link>
        <Link to='/greeting'>greeting</Link>
<Link to='/userManager'>UserManager</Link>
      </nav>
      <div>
        <Routes>
          <Route path='/task1' element={<Task1 />} />
          <Route path='/task2' element={<Task2 />} />
          <Route path='/greeting' element={<Greeting/>}/>
          <Route path='/userManager' element={<UserManager/>}/>
        </Routes>
      </div>
  
      </div>

   
  )
}

export default App
