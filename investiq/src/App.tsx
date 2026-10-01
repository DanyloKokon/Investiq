import { BrowserRouter, Routes, Route } from 'react-router'
import Enter from './components/EnterPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oath" element={<Enter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
