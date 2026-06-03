import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Shop from './pages/Shop'
import Cart from './pages/Cart'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/"         element={<PrivateRoute><Shop /></PrivateRoute>} />
      <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path="*"         element={<Navigate to="/" />} />
    </Routes>
  )
}
