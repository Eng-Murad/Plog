import { useState } from 'react'
import './App.css'
import Post from "./post"
import Header from './header'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { UserContextProvider } from './userContext'
import CreatePost from './pages/CreatePost'
import Postpage from './pages/postPage'
import EditPost from './pages/EditPost'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={
              <IndexPage />
            }/>
            <Route path={'/Login'} element={ <LoginPage /> }/>
            <Route path={'/register'} element={ <RegisterPage /> }/>
            <Route path="/Create" element={<CreatePost />}/>
            <Route path="/post/:id"  element={<Postpage />}/>
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
      </UserContextProvider>
      
      
    </>
  )
}

export default App
