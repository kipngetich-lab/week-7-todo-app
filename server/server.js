const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const cors = require('cors')
const connectDB = require('./config/db')
const path = require('path')

const currentDir= path.resolve();

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Route files
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

// Body parser
app.use(express.json())

// Enable CORS
app.use(cors())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}


// Mount routers
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

//production
if(process.env.NODE_ENV === "production"){
	app.use(express.static(path.join(currentDir,"/client/dist")));
	app.get("*",(req,res)=>{
		res.sendFile(path.resolve(currentDir,"client","dist","index.html"));
	})
}

// Error handling middleware
const { errorHandler } = require('./middleware/errorHandler')
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})