import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { useDispatch } from 'react-redux'
import Enter from './components/EnterPage'
import Header from './components/Header'
import './App.css'
import Home from './components/Home'
import { setAuthUser } from './redux/reducer'
import { supabase } from './utils/supabase'
import Calculations from './components/Calculations'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    let isActive = true
    let authChanged = false

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authChanged = true
      dispatch(setAuthUser(session?.user ?? null))
    })

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          throw error
        }
        if (isActive && !authChanged) {
          dispatch(setAuthUser(session?.user ?? null))
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          console.error('Failed to restore Supabase session:', error)
        }
      })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [dispatch])

  return (
    <div className='all'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/Investiq/oath" element={<Enter />} />
          <Route path="/Investiq/home/:type" element={<Home />}/>
          <Route path='/Investiq/calculations' element={<Calculations/>}/>
        </Routes>
      </BrowserRouter></div>
  )
}

export default App
