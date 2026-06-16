import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { UserRole } from "./types";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Inventory from "./pages/Inventory";
import Borrows from "./pages/Borrows";
import Repairs from "./pages/Repairs";
import InventoryCheck from "./pages/InventoryCheck";
import Reports from "./pages/Reports";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import EquipmentDetail from "./pages/EquipmentDetail";
import PurchaseOrders from "./pages/PurchaseOrders";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PermissionRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole: UserRole }) {
  const { user, getPermissionLevel } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const permissionLevels: Record<UserRole, number> = {
    employee: 1,
    department_admin: 2,
    it_staff: 3,
    admin: 4,
  };

  const userLevel = permissionLevels[user.role];
  const requiredLevel = permissionLevels[requiredRole];

  if (userLevel < requiredLevel) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/requests" element={
          <ProtectedRoute>
            <Layout>
              <Requests />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="it_staff">
              <Layout>
                <Inventory />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/borrows" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="department_admin">
              <Layout>
                <Borrows />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/repairs" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="department_admin">
              <Layout>
                <Repairs />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory-check" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="it_staff">
              <Layout>
                <InventoryCheck />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="it_staff">
              <Layout>
                <Reports />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/purchase-orders" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="it_staff">
              <Layout>
                <PurchaseOrders />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/logs" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="admin">
              <Layout>
                <Logs />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <PermissionRoute requiredRole="admin">
              <Layout>
                <Settings />
              </Layout>
            </PermissionRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/equipment/:id" element={
          <ProtectedRoute>
            <Layout>
              <EquipmentDetail />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}