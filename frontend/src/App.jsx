import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Showcase from './pages/Showcase'
import Lab from './pages/Lab'
import CookieConsent from './components/cookieConsent'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="h-12" />
      <Routes>
        <Route path="/" element={<Showcase />} />
        <Route path="/run" element={<Lab />} />
      </Routes>

      <CookieConsent/>
    </div>
  )
}

export default App