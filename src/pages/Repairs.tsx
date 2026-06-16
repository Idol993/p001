import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { users, getUserName, getEquipmentTypeName, getDepartmentName } from '../data/mockData';
import { Plus, Wrench, Clock, CheckCircle, AlertTriangle, User, XCircle, PlayCircle } from 'lucide-react';

export default function Repairs() {
  const { user } = useAuthStore();
  const { equipment, repairs, addRepair, assignRepair, completeRepair, updateEquipment } = useDataStore();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<typeof repairs[0] | null>(null);
  const [formData, setFormData] = useState({
    equipmentId: '',
    description: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
  });
  const [selectedTechnician, setSelectedTechnician] = useState('');

  const myEquipment = user?.role === 'employee'
    ? equipment.filter(e => e.ownerId === user.id && e.status !== 'scrapped')
    : equipment.filter(e => e.status !== 'scrapped');

  const pendingRepairs = repairs.filter(r => r.status === 'pending');
  const assignedRepairs = repairs.filter(r => r.status === 'assigned');
  const inProgressRepairs = repairs.filter(r => r.status === 'in_progress');
  const completedRepairs = repairs.filter(r => r.status === 'completed');

  const technicians = users.filter(u => u.role === 'it_staff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentId || !formData.description) return;

    addRepair({
      userId: user!.id,
      equipmentId: formData.equipmentId,
      description: formData.description,
      priority: formData.priority,
      status: 'pending',
    });

    updateEquipment(formData.equipmentId, {
      status: 'repairing' as const,
    });

    setFormData({ equipmentId: '', description: '', priority: 'normal' });
    setShowModal(false);
  };

  const handleAssign = () => {
    if (!selectedRepair || !selectedTechnician) return;
    
    assignRepair(selectedRepair.id, selectedTechnician);
    
    setSelectedTechnician('');
    setSelectedRepair(null);
  };

  const handleComplete = (repair: typeof repairs[0]) => {
    completeRepair(repair.id);
    updateEquipment(repair.equipmentId, {
      status: 'in_stock' as const,
    });
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: '低',
      normal: '普通',
      high: '高',
      urgent: '紧急',
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return colors[priority] || 'bg-gray-100 text-gray-600';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '待派单',
      assigned: '已派单',
      in_progress: '维修中',
      completed: '已完成',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-600',
      assigned: 'bg-blue-100 text-blue-600',
      in_progress: 'bg-orange-100 text-orange-600',
      completed: 'bg-green-100 text-green-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'assigned': return <PlayCircle className="w-4 h-4" />;
      case 'in_progress': return <Wrench className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">报修管理</h1>
          <p className="text-gray-500 mt-1">管理设备报修和维修流程</p>
        </div>
        {user?.role === 'employee' && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            提交报修
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待派单</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingRepairs.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已派单</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{assignedRepairs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">维修中</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{inProgressRepairs.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已完成</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedRepairs.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">故障描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">优先级</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">维修人员</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {repairs.map((repair) => {
                const equip = equipment.find(e => e.id === repair.equipmentId);
                const technician = users.find(u => u.id === repair.technicianId);
                return (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-800">{getUserName(repair.userId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{getEquipmentTypeName(equip?.typeId || '')}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{repair.description}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getPriorityColor(repair.priority)}`}>
                        {getPriorityLabel(repair.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{technician?.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`${getStatusColor(repair.status)} badge flex items-center gap-1`}>
                        {getStatusIcon(repair.status)}
                        {getStatusLabel(repair.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {repair.status === 'pending' && user?.role === 'it_staff' && (
                          <button
                            onClick={() => {
                              setSelectedRepair(repair);
                            }}
                            className="btn-primary text-sm"
                          >
                            <PlayCircle className="w-4 h-4" />
                            派单
                          </button>
                        )}
                        {repair.status === 'assigned' && user?.role === 'it_staff' && (
                          <button
                            onClick={() => {
                              updateEquipment(repair.equipmentId, { status: 'repairing' as const });
                              assignRepair(repair.id, user.id);
                            }}
                            className="btn-warning text-sm"
                          >
                            <Wrench className="w-4 h-4" />
                            开始维修
                          </button>
                        )}
                        {(repair.status === 'assigned' || repair.status === 'in_progress') && user?.role === 'it_staff' && (
                          <button
                            onClick={() => handleComplete(repair)}
                            className="btn-success text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            完成
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">提交报修</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择设备</label>
                  <select
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                    className="select"
                  >
                    <option value="">请选择设备</option>
                    {myEquipment.map((equip) => (
                      <option key={equip.id} value={equip.id}>
                        {getEquipmentTypeName(equip.typeId)} - {equip.serialNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">故障描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请详细描述设备故障情况..."
                    rows={4}
                    className="input resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
                  <div className="flex gap-2">
                    {(['low', 'normal', 'high', 'urgent'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.priority === priority
                            ? getPriorityColor(priority)
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {getPriorityLabel(priority)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" className="btn-primary flex-1">
                  提交报修
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedRepair && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">派单维修</h2>
              <button onClick={() => setSelectedRepair(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-1">报修信息</p>
              <p className="font-medium text-gray-800">{getEquipmentTypeName(equipment.find(e => e.id === selectedRepair.equipmentId)?.typeId || '')}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedRepair.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">选择维修人员</label>
              <select
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="select"
              >
                <option value="">请选择维修人员</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setSelectedRepair(null)} className="btn-secondary flex-1">
                取消
              </button>
              <button type="button" onClick={handleAssign} disabled={!selectedTechnician} className="btn-primary flex-1 disabled:opacity-50">
                <PlayCircle className="w-4 h-4" />
                确认派单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
