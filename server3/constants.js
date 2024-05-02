import dotenv from 'dotenv'
import queryString from 'query-string'

dotenv.config()

const config = {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUrl: process.env.REACT_APP_REDIRECT_URL,
    clientUrl: process.env.REACT_APP_CLIENT_URL,
    tokenSecret: process.env.REACT_APP_TOKEN_SECRET,
    tokenExpiration: 36000,
    postUrl: 'https://jsonplaceholder.typicode.com/posts',
  } 

  const authParams = queryString.stringify({
   client_id: config.clientId,
   redirect_uri: config.redirectUrl,
   response_type: 'code',
   scope: 'openid profile email',
   access_type: 'offline',
   state: 'standard_oauth',
   prompt: 'consent',
 })
 
 const getTokenParams = (code) =>
   queryString.stringify({
     client_id: config.clientId,
     client_secret: config.clientSecret,
     code,
     grant_type: 'authorization_code',
     redirect_uri: config.redirectUrl,
   })

   export {
    config,
    authParams,
    getTokenParams,
}