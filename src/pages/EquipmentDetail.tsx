import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import { getEquipmentTypeName, getDepartmentName, getUserName, users } from '../data/mockData';
import { ArrowLeft, Package, User, Calendar, MapPin, DollarSign, Shield, History, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { equipment, repairs, borrows, logs } = useDataStore();

  const equip = equipment.find(e => e.id === id);
  const owner = users.find(u => u.id === equip?.ownerId);
  const repairHistory = repairs.filter(r => r.equipmentId === id);
  const borrowHistory = borrows.filter(b => b.equipmentId === id);
  const equipLogs = logs.filter(l => l.targetId === id);

  if (!equip) {
    return (
      <div className="p-6">
        <div className="card p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">设备不存在</p>
          <button onClick={() => navigate('/inventory')} className="btn-primary mt-4">
            <ArrowLeft className="w-4 h-4" />
            返回库存列表
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      in_stock: { label: '库存中', className: 'badge-success', icon: <CheckCircle className="w-4 h-4" /> },
      assigned: { label: '已分配', className: 'badge-info', icon: <User className="w-4 h-4" /> },
      borrowed: { label: '借用中', className: 'badge-warning', icon: <Package className="w-4 h-4" /> },
      repairing: { label: '维修中', className: 'badge-warning', icon: <Wrench className="w-4 h-4" /> },
      scrapped: { label: '已报废', className: 'badge-danger', icon: <AlertTriangle className="w-4 h-4" /> },
    };
    return badges[status] || { label: status, className: 'badge-default', icon: null };
  };

  const statusBadge = getStatusBadge(equip.status);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/inventory')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{getEquipmentTypeName(equip.typeId)}</h1>
          <p className="text-gray-500 mt-1">序列号: {equip.serialNumber}</p>
        </div>
        <span className={`ml-auto ${statusBadge.className} flex items-center gap-1`}>
          {statusBadge.icon}
          {statusBadge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              基本信息
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  采购价格
                </p>
                <p className="font-semibold text-gray-800 mt-1">¥{equip.purchasePrice.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  采购日期
                </p>
                <p className="font-semibold text-gray-800 mt-1">{equip.purchaseDate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  保修截止
                </p>
                <p className="font-semibold text-gray-800 mt-1">{equip.warrantyEnd || '无'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  当前位置
                </p>
                <p className="font-semibold text-gray-800 mt-1">{equip.location}</p>
              </div>
            </div>
          </div>

          {owner && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                使用人信息
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{owner.name}</p>
                  <p className="text-gray-500">{getDepartmentName(owner.departmentId)}</p>
                  <p className="text-gray-500 text-sm">{owner.email}</p>
                </div>
              </div>
            </div>
          )}

          {repairHistory.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary-600" />
                维修记录
              </h2>
              <div className="space-y-4">
                {repairHistory.map((repair) => (
                  <div key={repair.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`badge ${repair.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {repair.status === 'completed' ? '已完成' : repair.status === 'in_progress' ? '维修中' : '待处理'}
                      </span>
                      <span className="text-sm text-gray-500">{repair.createdAt}</span>
                    </div>
                    <p className="text-gray-800">{repair.description}</p>
                    {repair.technicianId && (
                      <p className="text-sm text-gray-500 mt-2">处理人: {getUserName(repair.technicianId)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {borrowHistory.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" />
                借用记录
              </h2>
              <div className="space-y-4">
                {borrowHistory.map((borrow) => (
                  <div key={borrow.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`badge ${borrow.status === 'returned' ? 'badge-success' : 'badge-warning'}`}>
                        {borrow.status === 'returned' ? '已归还' : borrow.status === 'overdue' ? '已超期' : '借用中'}
                      </span>
                      <span className="text-sm text-gray-500">借用人: {getUserName(borrow.userId)}</span>
                    </div>
                    <p className="text-gray-800">
                      {borrow.startDate} ~ {borrow.endDate}
                      {borrow.actualReturnDate && ` (实际归还: ${borrow.actualReturnDate})`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary-600" />
              操作日志
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {equipLogs.length > 0 ? (
                equipLogs.map((log) => (
                  <div key={log.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700">{log.action}</span>
                      <span className="text-gray-400">{log.createdAt}</span>
                    </div>
                    <p className="text-gray-500">{log.detail}</p>
                    <p className="text-gray-400 text-xs mt-1">操作人: {getUserName(log.userId)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">暂无操作日志</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">设备状态</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">设备类型</span>
                <span className="font-medium">{getEquipmentTypeName(equip.typeId)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">所属部门</span>
                <span className="font-medium">{getDepartmentName(equip.departmentId || '') || '未分配'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">当前状态</span>
                <span className={`font-medium ${statusBadge.className}`}>{statusBadge.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}