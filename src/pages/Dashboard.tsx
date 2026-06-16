import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { dashboardStats, getUserName, getDepartmentName, getEquipmentTypeName } from '../data/mockData';
import { 
  Monitor, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  ArrowRightLeft,
  Wrench
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const statCards = [
  { label: '设备总数', value: dashboardStats.totalEquipment, icon: Monitor, color: 'bg-primary-500' },
  { label: '库存数量', value: dashboardStats.inStockEquipment, icon: Package, color: 'bg-success' },
  { label: '已分配', value: dashboardStats.assignedEquipment, icon: CheckCircle, color: 'bg-info' },
  { label: '借用中', value: dashboardStats.borrowedEquipment, icon: ArrowRightLeft, color: 'bg-warning' },
  { label: '维修中', value: dashboardStats.repairingEquipment, icon: Wrench, color: 'bg-orange-500' },
  { label: '待报废', value: dashboardStats.scrappedEquipment, icon: AlertTriangle, color: 'bg-danger' },
];

const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#0ea5e9', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { requests, approvals, repairs, borrows } = useDataStore();

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const pendingRepairs = repairs.filter(r => r.status === 'pending' || r.status === 'assigned');
  const overdueBorrows = borrows.filter(b => b.status === 'overdue');

  const myPendingRequests = user ? pendingRequests.filter(r => r.userId === user.id) : [];
  const myPendingApprovals = user ? pendingApprovals.filter(a => a.approverId === user.id) : [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">仪表盘</h1>
        <p className="text-gray-500 mt-1">欢迎回来，{user?.name} | {getDepartmentName(user?.departmentId || '')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">部门设备分布</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardStats.equipmentByDepartment}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardStats.equipmentByDepartment.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">部门故障率排行</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.failureRateByDepartment} layout="vertical">
                  <XAxis type="number" domain={[0, 20]} />
                  <YAxis type="category" dataKey="departmentName" width={60} />
                  <Tooltip formatter={(value) => [`${value}%`, '故障率']} />
                  <Bar dataKey="rate" fill="#ef4444" radius={[0, 4, 4, 0]}>
                    {dashboardStats.failureRateByDepartment.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#fbbf24'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              待办事项
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm">待审批申请</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{myPendingApprovals.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">我的待审批</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{myPendingRequests.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">待处理报修</span>
                </div>
                <span className="text-lg font-bold text-orange-600">{pendingRepairs.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm">超期借用</span>
                </div>
                <span className="text-lg font-bold text-red-600">{overdueBorrows.length}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              快速统计
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">总用户数</span>
                <span className="font-semibold text-gray-800">{dashboardStats.totalUsers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">部门数量</span>
                <span className="font-semibold text-gray-800">{dashboardStats.totalDepartments}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">待审批数</span>
                <span className="font-semibold text-gray-800">{dashboardStats.pendingRequests}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">待维修数</span>
                <span className="font-semibold text-gray-800">{dashboardStats.pendingRepairs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
