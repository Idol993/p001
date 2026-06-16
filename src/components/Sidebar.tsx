import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Monitor, 
  Package, 
  ArrowRightLeft, 
  Wrench, 
  ClipboardList, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  ShoppingCart
} from 'lucide-react';
import { getDepartmentName } from '../data/mockData';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/requests', icon: Monitor, label: '设备申领' },
  { path: '/inventory', icon: Package, label: '库存管理' },
  { path: '/purchase-orders', icon: ShoppingCart, label: '采购需求' },
  { path: '/borrows', icon: ArrowRightLeft, label: '借用管理' },
  { path: '/repairs', icon: Wrench, label: '报修管理' },
  { path: '/inventory-check', icon: ClipboardList, label: '资产盘点' },
  { path: '/reports', icon: BarChart3, label: '报表中心' },
  { path: '/logs', icon: FileText, label: '操作日志' },
  { path: '/settings', icon: Settings, label: '系统设置' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getPermissionLevel } = useAuthStore();
  const permissionLevel = getPermissionLevel();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter((item) => {
    const levelMap: Record<string, number> = {
      '/': 1,
      '/requests': 1,
      '/inventory': 3,
      '/purchase-orders': 3,
      '/borrows': 2,
      '/repairs': 2,
      '/inventory-check': 3,
      '/reports': 3,
      '/logs': 4,
      '/settings': 4,
    };
    const requiredLevel = levelMap[item.path] || 1;
    return permissionLevel >= requiredLevel;
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">IT资产管理</h1>
            <p className="text-xs text-gray-500">Asset Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{getDepartmentName(user.departmentId)}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">退出登录</span>
          </button>
        </div>
      )}
    </aside>
  );
}
