import { BrowserRouter, Routes, Route } from 'react-router'
import Enter from './components/EnterPage'
import Header from './components/Header'
import './App.css'
import Home from './components/Home'

function App() {
  return (
    <div className='all'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/investiq/oath" element={<Enter />} />
          <Route path="/investiq/home" element={<Home />} />
        </Routes>
      </BrowserRouter></div>
  )
}

export default App
