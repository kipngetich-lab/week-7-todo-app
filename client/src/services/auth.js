import axios from 'axios'

const API_URL = '/api/auth'

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData)
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

const logout = () => {
  localStorage.removeItem('user')
}

const getUser = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return null

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    return response.data
  } catch (error) {
    logout()
    return null
  }
}

export default {
  register,
  login,
  logout,
  getUser,
}