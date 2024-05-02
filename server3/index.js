import express from 'express'
import cors from 'cors'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import {config, authParams, getTokenParams} from './constants.js'

var app = express();

// Resolve CORS
app.use(
   cors({
     origin: [config.clientUrl],
     credentials: true,
   }),
 )
 
 // Parse Cookie
 app.use(cookieParser())

 // Verify auth
const auth = (req, res, next) => {
   try {
     const token = req.cookies.token
     if (!token) return res.status(401).json({ message: 'Unauthorized' })
     jwt.verify(token, config.tokenSecret)
     return next()
   } catch (err) {
     console.error('Error: ', err)
     res.status(401).json({ message: 'Unauthorized' })
   }
 }
 app.get('/auth/url', (_, res) => {
   res.json({
     url: `${config.authUrl}?${authParams}`,
   })
 })
 app.get('/auth/token', async (req, res) => {
   const { code } = req.query
   if (!code) return res.status(400).json({ message: 'Authorization code must be provided' })
   try {
     // Get all parameters needed to hit authorization server
     const tokenParam = getTokenParams(code)
     // Exchange authorization code for access token (id token is returned here too)
     const {
       data: { id_token },
     } = await axios.post(`${config.tokenUrl}?${tokenParam}`)
     if (!id_token) return res.status(400).json({ message: 'Auth error' })
     // Get user info from id token
     const { email, name, picture } = jwt.decode(id_token)
     const user = { name, email, picture }
     // Sign a new token
     const token = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration })
     // Set cookies for user
     res.cookie('token', token, { maxAge: config.tokenExpiration, httpOnly: true })
     // You can choose to store user in a DB instead
     res.json({
       user,
     })
   } catch (err) {
     console.error('Error: ', err)
     res.status(500).json({ message: err.message || 'Server error' })
   }
 })

 app.get('/auth/logged_in', (req, res) => {
   try {
     // Get token from cookie
     const token = req.cookies.token
     if (!token) return res.json({ loggedIn: false })
     const { user } = jwt.verify(token, config.tokenSecret)
     const newToken = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration })
     // Reset token in cookie
     res.cookie('token', newToken, { maxAge: config.tokenExpiration, httpOnly: true })
     res.json({ loggedIn: true, user })
   } catch (err) {
     res.json({ loggedIn: false })
   }
 })

 app.post('/auth/logout', (_, res) => {
   // clear cookie
   res.clearCookie('token').json({ message: 'Logged out' })
 })
 
 app.get('/user/posts', auth, async (_, res) => {
   try {
     const { data } = await axios.get(config.postUrl)
     res.json({ posts: data?.slice(0, 5) })
   } catch (err) {
     console.error('Error: ', err)
   }
 })

app.get('/', function (req, res) {
   res.send('Hello Server 3.5 ' + config.clientUrl);
})

const PORT = process.env.PORT || 5005

var server = app.listen(PORT, function () {
   console.log('Express App running at http://localhost:5005/');
})