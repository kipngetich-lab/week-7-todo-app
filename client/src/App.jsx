import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import AuthContext from './context/AuthContext'
import useDarkMode from './hooks/useDarkMode'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'
import authService from './services/auth'
import Footer from './components/Footer'
function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useDarkMode()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

   return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div className={darkMode ? 'dark' : ''}>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <div className="container mx-auto px-4 py-8 flex-grow">
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Redirect to="/" />
              </Switch>
            </div>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App