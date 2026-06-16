import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
            <Layout>
              <Inventory />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/borrows" element={
          <ProtectedRoute>
            <Layout>
              <Borrows />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/repairs" element={
          <ProtectedRoute>
            <Layout>
              <Repairs />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory-check" element={
          <ProtectedRoute>
            <Layout>
              <InventoryCheck />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/logs" element={
          <ProtectedRoute>
            <Layout>
              <Logs />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
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