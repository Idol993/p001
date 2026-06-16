import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { users, getUserName, getEquipmentTypeName, getDepartmentName, getBorrowReminderDays, getBorrowOverdueDays } from '../data/mockData';
import { Plus, ArrowRightLeft, Calendar, Clock, AlertTriangle, CheckCircle, User, XCircle } from 'lucide-react';

export default function Borrows() {
  const { user } = useAuthStore();
  const { equipment, borrows, addBorrow, returnBorrow, updateEquipment } = useDataStore();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: '',
    startDate: '',
    endDate: '',
  });

  const availableEquipment = equipment.filter(e => e.status === 'assigned' || e.status === 'in_stock');
  const activeBorrows = borrows.filter(b => b.status === 'active' || b.status === 'overdue');
  const returnedBorrows = borrows.filter(b => b.status === 'returned');

  const filteredBorrows = user?.role === 'employee'
    ? activeBorrows.filter(b => b.userId === user.id)
    : activeBorrows;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentId || !formData.startDate || !formData.endDate) return;

    addBorrow({
      userId: user!.id,
      equipmentId: formData.equipmentId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'active',
    });

    updateEquipment(formData.equipmentId, {
      status: 'borrowed' as const,
    });

    setFormData({ equipmentId: '', startDate: '', endDate: '' });
    setShowModal(false);
  };

  const handleReturn = (borrow: typeof borrows[0]) => {
    returnBorrow(borrow.id);
    updateEquipment(borrow.equipmentId, {
      status: 'in_stock' as const,
      ownerId: undefined,
    });
  };

  const getDaysUntilDue = (endDate: string) => {
    const today = new Date();
    const due = new Date(endDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getBorrowStatus = (endDate: string, status: string) => {
    if (status === 'returned') return { label: '已归还', color: 'bg-green-100 text-green-600' };
    const days = getDaysUntilDue(endDate);
    if (days < -getBorrowOverdueDays()) return { label: `超期${Math.abs(days)}天`, color: 'bg-red-100 text-red-600' };
    if (days < 0) return { label: `超期${Math.abs(days)}天`, color: 'bg-orange-100 text-orange-600' };
    if (days <= getBorrowReminderDays()) return { label: `${days}天后到期`, color: 'bg-yellow-100 text-yellow-600' };
    return { label: '借用中', color: 'bg-blue-100 text-blue-600' };
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">借用管理</h1>
          <p className="text-gray-500 mt-1">管理设备借用申请和归还</p>
        </div>
        {user?.role === 'employee' && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            申请借用
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary-600" />
              借用中
            </h2>
            <span className="badge-default">{filteredBorrows.length}笔</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto scrollbar-thin">
            {filteredBorrows.map((borrow) => {
              const equip = equipment.find(e => e.id === borrow.equipmentId);
              const borrower = users.find(u => u.id === borrow.userId);
              const status = getBorrowStatus(borrow.endDate, borrow.status);
              const daysUntilDue = getDaysUntilDue(borrow.endDate);
              
              return (
                <div key={borrow.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          daysUntilDue < -getBorrowOverdueDays() ? 'bg-red-100' :
                          daysUntilDue < 0 ? 'bg-orange-100' :
                          daysUntilDue <= getBorrowReminderDays() ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          {daysUntilDue < -getBorrowOverdueDays() ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : daysUntilDue < 0 ? (
                            <Clock className="w-5 h-5 text-orange-600" />
                          ) : daysUntilDue <= getBorrowReminderDays() ? (
                            <Calendar className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{getEquipmentTypeName(equip?.typeId || '')}</p>
                          <p className="text-sm text-gray-500">SN: {equip?.serialNumber || '-'}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 ml-13">
                        <div className="flex gap-4">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {borrower?.name || '-'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {borrow.startDate} ~ {borrow.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`badge ${status.color}`}>{status.label}</span>
                      {user?.role === 'it_staff' && borrow.status !== 'returned' && (
                        <button
                          onClick={() => handleReturn(borrow)}
                          className="btn-success text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          确认归还
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredBorrows.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <ArrowRightLeft className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无借用记录</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              已归还
            </h2>
            <span className="badge-success">{returnedBorrows.length}笔</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto scrollbar-thin">
            {returnedBorrows.map((borrow) => {
              const equip = equipment.find(e => e.id === borrow.equipmentId);
              const borrower = users.find(u => u.id === borrow.userId);
              return (
                <div key={borrow.id} className="p-4 hover:bg-gray-50 opacity-75">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{getEquipmentTypeName(equip?.typeId || '')}</p>
                      <div className="flex gap-4 mt-1 text-sm text-gray-500">
                        <span>{borrower?.name || '-'}</span>
                        <span>{borrow.startDate} ~ {borrow.actualReturnDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {returnedBorrows.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无已归还记录</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">申请借用设备</h2>
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
                    {availableEquipment.map((equip) => (
                      <option key={equip.id} value={equip.id}>
                        {getEquipmentTypeName(equip.typeId)} - {equip.serialNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">借用开始</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">借用结束</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" className="btn-primary flex-1">
                  提交申请
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
