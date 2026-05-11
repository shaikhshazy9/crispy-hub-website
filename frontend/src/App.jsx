import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import { AuthProvider }  from './context/AuthContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import HomePage      from './pages/HomePage'
import OrdersPage    from './pages/OrdersPage'
import AdminLogin    from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders   from './pages/admin/AdminOrders'
import AdminUsers    from './pages/admin/AdminUsers'
import AdminMessages from './pages/admin/AdminMessages'
import AdminMenu     from './pages/admin/AdminMenu'

function ProtectedAdmin({ children }) {
  const { admin } = useAdmin()
  return admin ? children : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <OrderProvider>
            <Routes>
              {/* Customer routes */}
              <Route path="/"       element={<HomePage />} />
              <Route path="/orders" element={<OrdersPage />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
              <Route path="/admin/orders"    element={<ProtectedAdmin><AdminOrders /></ProtectedAdmin>} />
              <Route path="/admin/users"     element={<ProtectedAdmin><AdminUsers /></ProtectedAdmin>} />
              <Route path="/admin/messages"  element={<ProtectedAdmin><AdminMessages /></ProtectedAdmin>} />
              <Route path="/admin/menu"      element={<ProtectedAdmin><AdminMenu /></ProtectedAdmin>} />
            </Routes>
          </OrderProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
