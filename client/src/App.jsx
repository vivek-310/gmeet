import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Room from './pages/Room'
import { Routes, Route,BrowserRouter } from 'react-router-dom'

function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
