import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import { equipmentTypes, getEquipmentTypeName, getDepartmentName } from '../data/mockData';
import { Plus, Package, Warehouse, CheckCircle, ArrowRight, XCircle, User, FileText } from 'lucide-react';
import { users } from '../data/mockData';

export default function Inventory() {
  const navigate = useNavigate();
  const { equipment, inventory, addEquipment, updateEquipment, addInventory, updateInventory } = useDataStore();
  
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<typeof equipment[0] | null>(null);
  const [formData, setFormData] = useState({
    serialNumber: '',
    typeId: '',
    location: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyEnd: '',
    quantity: 1,
  });
  const [assignUserId, setAssignUserId] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statusTabs = [
    { key: 'all', label: '全部', count: equipment.length },
    { key: 'in_stock', label: '库存中', count: equipment.filter(e => e.status === 'in_stock').length },
    { key: 'assigned', label: '已分配', count: equipment.filter(e => e.status === 'assigned').length },
    { key: 'borrowed', label: '借用中', count: equipment.filter(e => e.status === 'borrowed').length },
    { key: 'repairing', label: '维修中', count: equipment.filter(e => e.status === 'repairing').length },
    { key: 'scrapped', label: '已报废', count: equipment.filter(e => e.status === 'scrapped').length },
  ];

  const filteredEquipment = statusFilter === 'all' 
    ? equipment 
    : equipment.filter(e => e.status === statusFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serialNumber || !formData.typeId || !formData.purchaseDate) return;

    const baseEquipment = {
      typeId: formData.typeId,
      status: 'in_stock' as const,
      location: formData.location || '仓库',
      purchaseDate: formData.purchaseDate,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      warrantyEnd: formData.warrantyEnd || '',
    };

    const quantity = formData.quantity || 1;
    const batchId = `batch${Date.now()}`;
    
    for (let i = 0; i < quantity; i++) {
      const serialNumber = quantity === 1 
        ? formData.serialNumber 
        : `${formData.serialNumber}-${String(i + 1).padStart(3, '0')}`;
      
      const equipmentId = `e${Date.now()}-${i}`;
      
      addEquipment({
        ...baseEquipment,
        serialNumber,
        batchId,
      });

      addInventory({
        equipmentId,
        quantity: 1,
        location: formData.location || '仓库',
      });
    }

    setFormData({
      serialNumber: '',
      typeId: '',
      location: '',
      purchaseDate: '',
      purchasePrice: '',
      warrantyEnd: '',
      quantity: 1,
    });
    setShowModal(false);
  };

  const handleAssign = () => {
    if (!selectedEquipment || !assignUserId) return;

    const user = users.find(u => u.id === assignUserId);
    
    updateEquipment(selectedEquipment.id, {
      status: 'assigned' as const,
      ownerId: assignUserId,
      departmentId: user?.departmentId,
      location: `${getDepartmentName(user?.departmentId || '')}工位`,
    });

    setAssignUserId('');
    setShowAssignModal(false);
    setSelectedEquipment(null);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      in_stock: '库存中',
      assigned: '已分配',
      borrowed: '借用中',
      repairing: '维修中',
      scrapped: '已报废',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      in_stock: 'bg-green-100 text-green-600',
      assigned: 'bg-blue-100 text-blue-600',
      borrowed: 'bg-orange-100 text-orange-600',
      repairing: 'bg-yellow-100 text-yellow-600',
      scrapped: 'bg-red-100 text-red-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">库存管理</h1>
          <p className="text-gray-500 mt-1">管理设备库存和设备分配</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          入库设备
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  statusFilter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  statusFilter === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto scrollbar-thin">
          {filteredEquipment.map((item) => {
            const owner = users.find(u => u.id === item.ownerId);
            return (
              <div key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/equipment/${item.id}`)}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    item.status === 'in_stock' ? 'bg-green-100' :
                    item.status === 'assigned' ? 'bg-blue-100' :
                    item.status === 'borrowed' ? 'bg-orange-100' :
                    item.status === 'repairing' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {item.status === 'in_stock' ? <Warehouse className="w-6 h-6 text-green-600" /> :
                     item.status === 'assigned' ? <User className="w-6 h-6 text-blue-600" /> :
                     item.status === 'borrowed' ? <ArrowRight className="w-6 h-6 text-orange-600" /> :
                     item.status === 'repairing' ? <Package className="w-6 h-6 text-yellow-600" /> :
                     <Package className="w-6 h-6 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{getEquipmentTypeName(item.typeId)}</p>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">SN: {item.serialNumber}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      {owner && <span>使用人: {owner.name}</span>}
                      {item.departmentId && <span>部门: {getDepartmentName(item.departmentId)}</span>}
                      <span>价格: ¥{item.purchasePrice.toLocaleString()}</span>
                      <span>位置: {item.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/equipment/${item.id}`);
                      }}
                      className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded bg-gray-100 text-sm flex items-center gap-1"
                      title="查看档案"
                    >
                      <FileText className="w-4 h-4" />
                      档案
                    </button>
                    {item.status === 'in_stock' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEquipment(item);
                          setShowAssignModal(true);
                        }}
                        className="btn-primary text-sm flex items-center gap-1"
                      >
                        <ArrowRight className="w-4 h-4" />
                        分配
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredEquipment.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>暂无{statusFilter === 'all' ? '' : getStatusLabel(statusFilter)}设备</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">设备入库</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">设备类型</label>
                  <select
                    value={formData.typeId}
                    onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                    className="select"
                  >
                    <option value="">请选择设备类型</option>
                    {equipmentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ¥{type.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">序列号</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="请输入设备序列号"
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">采购日期</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">保修截止</label>
                    <input
                      type="date"
                      value={formData.warrantyEnd}
                      onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">采购价格</label>
                    <input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      placeholder="0.00"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">入库数量</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">存放位置</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="例如：仓库A区"
                    className="input"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" className="btn-primary flex-1">
                  确认入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">分配设备</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-1">设备信息</p>
              <p className="font-medium text-gray-800">{getEquipmentTypeName(selectedEquipment.typeId)}</p>
              <p className="text-sm text-gray-500">SN: {selectedEquipment.serialNumber}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">选择使用人</label>
              <select
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                className="select"
              >
                <option value="">请选择使用人</option>
                {users.filter(u => u.role !== 'admin').map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {getDepartmentName(user.departmentId)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowAssignModal(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button type="button" onClick={handleAssign} disabled={!assignUserId} className="btn-primary flex-1 disabled:opacity-50">
                <CheckCircle className="w-4 h-4" />
                确认分配
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
