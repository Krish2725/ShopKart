import './App.css'
import Login from './pages/Login.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import React from 'react'
import Register from './pages/Register.jsx'
 
 function App() {
   return (
     <>
     <BrowserRouter>
     <Routes>
        <Route path = '/login' element= {<Login/>}/>
        <Route path = '/register' element = {<Register/>}/>
        <Route path = '/' element = {<Home/>}/>
     </Routes>
        <Login/>
        <Register/>
        <Home/>
     </BrowserRouter>
        
     </>
   )
 }
 
 export default App