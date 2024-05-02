import { createContext } from 'react'

const config = {
    serverUrl : process.env.REACT_APP_SERVER_URL,
    AuthContext: createContext()
}
export default config