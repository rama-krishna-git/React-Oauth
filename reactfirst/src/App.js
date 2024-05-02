import logo from './logo.svg';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState, useContext, useCallback } from 'react'
import Dashboard  from './dashboard';
import {Login,Callback} from './login'
import config  from './constants';

// Ensures cookie is sent
axios.defaults.withCredentials = true

const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null)
  const [user, setUser] = useState(null)

  const checkLoginState = useCallback(async () => {
    try {
      const {
        data: { loggedIn: logged_in, user },
      } = await axios.get(`${config.serverUrl}/auth/logged_in`)
      setLoggedIn(logged_in)
      user && setUser(user)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    checkLoginState()
  }, [checkLoginState])

  return <config.AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>{children}</config.AuthContext.Provider>
}

const Home = () => {
  const { loggedIn } = useContext(config.AuthContext)
  if (loggedIn === true) return <Dashboard />
  if (loggedIn === false) return <Login />
  return <></>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/callback', // google will redirect here
    element: <Callback />,
  },
])

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </header>
    </div>
  )
}

export default App;
