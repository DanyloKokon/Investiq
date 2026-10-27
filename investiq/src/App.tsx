import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { useDispatch } from 'react-redux'
import Enter from './components/EnterPage'
import Header from './components/Header'
import './App.css'
import Home from './components/Home'
import { setAuthUser } from './redux/reducer'
import { supabase } from './utils/supabase'
import Calculations from './components/Calculations'
import { DatePicker } from './components/aditionalComp/application/date-picker/date-picker'
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "react-aria-components";



function App() {
  const now = today(getLocalTimeZone());
  const [value, setValue] = useState<DateValue | null>(now);
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
          <Route path="/oath" element={<Enter />} />
          <Route path="/home/:type" element={<Home />} />
          <Route path='/calculations' element={<Calculations />} />
          <Route path='/test' element={<DatePicker aria-label="Date picker" value={value} onChange={setValue} />} />
        </Routes>
      </BrowserRouter></div>
  )
}

export default App
