import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { equipmentTypes, users, getUserName, getEquipmentTypeName, getDepartmentName, getApprovalThreshold } from '../data/mockData';
import { Plus, FileText, CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight, User } from 'lucide-react';

export default function Requests() {
  const { user, hasPermission } = useAuthStore();
  const { requests, approvals, addRequest, addApproval, handleApprovalAction } = useDataStore();
  
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof requests[0] | null>(null);
  const [formData, setFormData] = useState({
    equipmentTypeId: '',
    quantity: 1,
    purpose: '',
  });
  const [approvalComment, setApprovalComment] = useState('');

  const filteredRequests = user?.role === 'employee' 
    ? requests.filter(r => r.userId === user.id)
    : user?.role === 'department_admin'
    ? requests.filter(r => {
        const requester = users.find(u => u.id === r.userId);
        return requester?.departmentId === user?.departmentId;
      })
    : requests;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentTypeId || !formData.purpose) return;

    const equipmentType = equipmentTypes.find(t => t.id === formData.equipmentTypeId);
    if (!equipmentType) return;

    const totalAmount = equipmentType.price * formData.quantity;
    const needsDirectorApproval = totalAmount > getApprovalThreshold();

    const { requestId } = addRequest({
      userId: user!.id,
      equipmentTypeId: formData.equipmentTypeId,
      quantity: formData.quantity,
      purpose: formData.purpose,
      totalAmount,
      status: 'pending',
    });

    const departmentAdmin = users.find(u => u.role === 'department_admin' && u.departmentId === user?.departmentId);
    if (departmentAdmin) {
      addApproval({
        requestId,
        approverId: departmentAdmin.id,
        status: 'pending',
        comment: '',
      });
    }

    if (needsDirectorApproval) {
      const admin = users.find(u => u.role === 'admin');
      if (admin) {
        addApproval({
          requestId,
          approverId: admin.id,
          status: 'pending',
          comment: '',
        });
      }
    }

    setFormData({ equipmentTypeId: '', quantity: 1, purpose: '' });
    setShowModal(false);
  };

  const handleApprove = () => {
    if (!selectedRequest || !user) return;
    
    handleApprovalAction(selectedRequest.id, user.id, 'approved', approvalComment);

    setApprovalComment('');
    setShowDetailModal(false);
  };

  const handleReject = () => {
    if (!selectedRequest || !user) return;
    
    handleApprovalAction(selectedRequest.id, user.id, 'rejected', approvalComment);
    
    setApprovalComment('');
    setShowDetailModal(false);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      pending: { label: '待审批', className: 'badge-default' },
      approved: { label: '已批准', className: 'badge-success' },
      rejected: { label: '已驳回', className: 'badge-danger' },
      allocated: { label: '已分配', className: 'badge-info' },
      purchasing: { label: '采购中', className: 'badge-warning' },
    };
    return badges[status] || { label: status, className: 'badge-default' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'allocated': return <CheckCircle className="w-4 h-4" />;
      case 'purchasing': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const canApprove = (request: typeof requests[0]) => {
    if (!user) return false;
    const myApproval = approvals.find(a => a.requestId === request.id && a.approverId === user.id);
    return myApproval?.status === 'pending';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">设备申领</h1>
          <p className="text-gray-500 mt-1">管理设备申领申请和审批流程</p>
        </div>
        {hasPermission('employee') && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            新建申领
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">申请人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">部门</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">总金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用途</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => {
                const requester = users.find(u => u.id === request.userId);
                const statusBadge = getStatusBadge(request.status);
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-800">{getUserName(request.userId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{requester ? getDepartmentName(requester.departmentId) : '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{getEquipmentTypeName(request.equipmentTypeId)}</td>
                    <td className="px-6 py-4 text-gray-600">{request.quantity}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">¥{request.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{request.purpose}</td>
                    <td className="px-6 py-4">
                      <span className={`${statusBadge.className} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-800 flex items-center gap-1 text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        详情
                      </button>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">新建设备申领</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">设备类型</label>
                  <select
                    value={formData.equipmentTypeId}
                    onChange={(e) => setFormData({ ...formData, equipmentTypeId: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">申领用途</label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="请说明申领设备的用途..."
                    rows={3}
                    className="input resize-none"
                  />
                </div>
                {formData.equipmentTypeId && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">单价</span>
                      <span className="font-medium">¥{equipmentTypes.find(t => t.id === formData.equipmentTypeId)?.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">数量</span>
                      <span className="font-medium">{formData.quantity}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                      <span className="text-gray-700 font-medium">总金额</span>
                      <span className="text-lg font-bold text-primary-600">
                        ¥{(equipmentTypes.find(t => t.id === formData.equipmentTypeId)?.price || 0 * formData.quantity).toLocaleString()}
                      </span>
                    </div>
                    {(equipmentTypes.find(t => t.id === formData.equipmentTypeId)?.price || 0) * formData.quantity > getApprovalThreshold() && (
                      <div className="mt-2 text-sm text-warning flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        金额超过{getApprovalThreshold()}元，需部门总监审批
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  取消
                </button>
                <button type="submit" className="btn-primary flex-1">
                  提交申领
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">申领详情</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">申请人</p>
                <p className="font-medium text-gray-800">{getUserName(selectedRequest.userId)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">部门</p>
                <p className="font-medium text-gray-800">{getDepartmentName(users.find(u => u.id === selectedRequest.userId)?.departmentId || '')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">设备类型</p>
                <p className="font-medium text-gray-800">{getEquipmentTypeName(selectedRequest.equipmentTypeId)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">数量</p>
                <p className="font-medium text-gray-800">{selectedRequest.quantity}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">总金额</p>
                <p className="font-medium text-primary-600">¥{selectedRequest.totalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">状态</p>
                <span className={`${getStatusBadge(selectedRequest.status).className} mt-1 inline-block`}>
                  {getStatusBadge(selectedRequest.status).label}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500 mb-2">申领用途</p>
              <p className="text-gray-800">{selectedRequest.purpose}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">审批流程</h3>
              <div className="space-y-3">
                {approvals.filter(a => a.requestId === selectedRequest.id).map((approval, index) => (
                  <div key={approval.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      approval.status === 'approved' ? 'bg-green-100 text-green-600' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {approval.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                       approval.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{getUserName(approval.approverId)}</span>
                        <span className={`text-xs ${getStatusBadge(approval.status).className}`}>
                          {approval.status === 'approved' ? '已批准' : approval.status === 'rejected' ? '已驳回' : '待审批'}
                        </span>
                      </div>
                      {approval.comment && (
                        <p className="text-sm text-gray-500 mt-1">{approval.comment}</p>
                      )}
                    </div>
                    {index < approvals.filter(a => a.requestId === selectedRequest.id).length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {canApprove(selectedRequest) && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">审批操作</h3>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="请输入审批意见（可选）"
                  rows={2}
                  className="input w-full mb-4 resize-none"
                />
                <div className="flex gap-3">
                  <button onClick={handleReject} className="btn-danger flex-1">
                    <XCircle className="w-4 h-4" />
                    驳回
                  </button>
                  <button onClick={handleApprove} className="btn-success flex-1">
                    <CheckCircle className="w-4 h-4" />
                    批准
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
