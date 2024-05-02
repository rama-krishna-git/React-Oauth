
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import config  from './constants';

const Login = () => {
    const handleLogin = async () => {
      try {
        // Gets authentication url from backend server
        const {
          data: { url },
        } = await axios.get(`${config.serverUrl}/auth/url`)
        // Navigate to consent screen
        window.location.assign(url)
      } catch (err) {
        console.error(err)
      }
    }
    return (
      <>
        <h3>Login to Dashboard</h3>
        <button className="btn" onClick={handleLogin}>
          Login
        </button>
      </>
    )
  }

  const Callback = () => {
    const called = useRef(false)
    const { checkLoginState, loggedIn } = useContext(config.AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
      ;(async () => {
        if (loggedIn === false) {
          try {
            if (called.current) return // prevent rerender caused by StrictMode
            called.current = true
            const res = await axios.get(`${config.serverUrl}/auth/token${window.location.search}`)
            console.log('response: ', res)
            checkLoginState()
            navigate('/')
          } catch (err) {
            console.error(err)
            navigate('/')
          }
        } else if (loggedIn === true) {
          navigate('/')
        }
      })()
    }, [checkLoginState, loggedIn, navigate])
    return <></>
  }

  export {Login, Callback}