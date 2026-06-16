import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import { getEquipmentTypeName, getDepartmentName, getUserName } from '../data/mockData';
import { ArrowLeft, Package, User, Calendar, MapPin, DollarSign, Shield, History, AlertTriangle, CheckCircle, Wrench, ArrowRightLeft, ClipboardList, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'inventory' | 'allocation' | 'borrow' | 'return' | 'repair' | 'repair_complete' | 'inventory_check';
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { equipment, repairs, borrows, inventoryChecks, requests, users, logs } = useDataStore();

  const equip = equipment.find(e => e.id === id);
  const owner = users.find(u => u.id === equip?.ownerId);
  const repairHistory = repairs.filter(r => r.equipmentId === id);
  const borrowHistory = borrows.filter(b => b.equipmentId === id);
  const checkHistory = inventoryChecks.filter(c => c.equipmentId === id);
  const equipLogs = logs.filter(l => l.targetId === id);

  if (!equip) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">设备不存在</p>
          <button onClick={() => navigate('/inventory')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            返回库存列表
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      in_stock: { label: '库存中', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      assigned: { label: '已分配', className: 'bg-blue-100 text-blue-800', icon: <User className="w-4 h-4" /> },
      borrowed: { label: '借用中', className: 'bg-yellow-100 text-yellow-800', icon: <Package className="w-4 h-4" /> },
      repairing: { label: '维修中', className: 'bg-orange-100 text-orange-800', icon: <Wrench className="w-4 h-4" /> },
      scrapped: { label: '已报废', className: 'bg-gray-100 text-gray-600', icon: <AlertTriangle className="w-4 h-4" /> },
    };
    return badges[status] || { label: status, className: 'bg-gray-100 text-gray-600', icon: null };
  };

  const statusBadge = getStatusBadge(equip.status);

  const timelineEvents: TimelineEvent[] = [];

  timelineEvents.push({
    id: `inv-${equip.id}`,
    type: 'inventory',
    title: '设备入库',
    description: `设备入库到 ${equip.location}`,
    date: equip.createdAt,
    icon: <Package className="w-5 h-5" />,
    color: 'bg-blue-500',
  });

  if (equip.ownerId) {
    const assignRequest = requests.find(r => 
      r.equipmentTypeId === equip.typeId && 
      (r.status === 'allocated' || r.status === 'approved')
    );
    const assignee = users.find(u => u.id === equip.ownerId);
    timelineEvents.push({
      id: `alloc-${equip.id}`,
      type: 'allocation',
      title: '设备分配',
      description: `分配给 ${assignee?.name || '未知用户'}`,
      date: equip.updatedAt,
      icon: <User className="w-5 h-5" />,
      color: 'bg-green-500',
    });
  }

  borrowHistory.forEach(borrow => {
    const borrower = users.find(u => u.id === borrow.userId);
    timelineEvents.push({
      id: `borrow-${borrow.id}`,
      type: 'borrow',
      title: '设备借用',
      description: `由 ${borrower?.name || '未知用户'} 借用，预计归还: ${borrow.endDate}`,
      date: borrow.createdAt,
      icon: <ArrowRightLeft className="w-5 h-5" />,
      color: 'bg-yellow-500',
    });

    if (borrow.actualReturnDate) {
      timelineEvents.push({
        id: `return-${borrow.id}`,
        type: 'return',
        title: '设备归还',
        description: `${borrower?.name || '未知用户'} 已归还设备`,
        date: borrow.actualReturnDate,
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'bg-green-500',
      });
    }
  });

  repairHistory.forEach(repair => {
    const reporter = users.find(u => u.id === repair.userId);
    const technician = users.find(u => u.id === repair.technicianId);
    
    timelineEvents.push({
      id: `repair-${repair.id}`,
      type: 'repair',
      title: '报修申请',
      description: `${reporter?.name || '未知用户'} 报修: ${repair.description}`,
      date: repair.createdAt,
      icon: <Wrench className="w-5 h-5" />,
      color: 'bg-red-500',
    });

    if (repair.status === 'completed') {
      timelineEvents.push({
        id: `repair-complete-${repair.id}`,
        type: 'repair_complete',
        title: '维修完成',
        description: `由 ${technician?.name || '未知人员'} 完成维修`,
        date: repair.updatedAt,
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'bg-teal-500',
      });
    }
  });

  checkHistory.forEach(check => {
    timelineEvents.push({
      id: `check-${check.id}`,
      type: 'inventory_check',
      title: '盘点记录',
      description: `账面: ${check.expectedQuantity} | 实际: ${check.actualQuantity} | ${check.status === 'completed' ? '已完成' : '进行中'}`,
      date: check.checkDate,
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'bg-purple-500',
    });
  });

  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusBadge.className}`}>
          {statusBadge.icon}
          {statusBadge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
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
            {equip.batchId && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">批次号: <span className="font-medium text-gray-700">{equip.batchId}</span></p>
              </div>
            )}
          </div>

          {owner && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                使用人信息
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{owner.name}</p>
                  <p className="text-gray-500">{getDepartmentName(owner.departmentId)}</p>
                  <p className="text-gray-500 text-sm">{owner.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              生命周期时间线
            </h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {timelineEvents.length > 0 ? (
                  timelineEvents.map((event, index) => (
                    <div key={event.id} className="relative pl-12">
                      <div className={`absolute left-4 w-5 h-5 rounded-full ${event.color} flex items-center justify-center text-white`}>
                        {event.icon}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{event.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>暂无生命周期记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              维修记录
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {repairHistory.length > 0 ? (
                repairHistory.map((repair) => (
                  <div key={repair.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        repair.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        repair.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {repair.status === 'completed' ? '已完成' : repair.status === 'in_progress' ? '维修中' : '待处理'}
                      </span>
                      <span className="text-xs text-gray-500">{repair.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">{repair.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm">暂无维修记录</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              借用记录
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {borrowHistory.length > 0 ? (
                borrowHistory.map((borrow) => (
                  <div key={borrow.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        borrow.status === 'returned' ? 'bg-green-100 text-green-800' : 
                        borrow.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {borrow.status === 'returned' ? '已归还' : borrow.status === 'overdue' ? '已超期' : '借用中'}
                      </span>
                      <span className="text-xs text-gray-500">{getUserName(borrow.userId)}</span>
                    </div>
                    <p className="text-sm text-gray-800">{borrow.startDate} ~ {borrow.endDate}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm">暂无借用记录</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
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