import { useState } from 'react'

import './App.css'
import Task1 from './dailytask/Task1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        
      </div>
     
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
       <Task1/>
      </div>

    </>
  )
}

export default App
