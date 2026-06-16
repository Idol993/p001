import React from 'react';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';

const PurchaseOrders: React.FC = () => {
  const { purchaseOrders, requests, users, equipmentTypes, updatePurchaseOrderStatus, receivePurchaseOrder } = useDataStore();
  const { user } = useAuthStore();

  const canOperate = user?.role === 'it_staff' || user?.role === 'admin';

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '待处理',
      purchasing: '采购中',
      ordered: '已下单',
      arrived: '已到货',
      received: '已入库',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      purchasing: 'bg-blue-100 text-blue-800',
      ordered: 'bg-purple-100 text-purple-800',
      arrived: 'bg-green-100 text-green-800',
      received: 'bg-gray-100 text-gray-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const handleStatusChange = (id: string, status: string) => {
    updatePurchaseOrderStatus(id, status as any);
  };

  const handleReceive = (id: string) => {
    receivePurchaseOrder(id);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">采购需求看板</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">采购单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预算金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">来源申领单</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">当前状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseOrders.map((po) => {
                const request = requests.find(r => r.id === po.requestId);
                const requester = request ? users.find(u => u.id === request.userId) : null;
                const equipmentType = equipmentTypes.find(et => et.id === po.equipmentTypeId);

                return (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{po.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{requester?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipmentType?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{po.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{po.budgetAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{po.requestId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(po.status)}`}>
                        {getStatusLabel(po.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canOperate && po.status !== 'received' && (
                        <div className="flex space-x-2">
                          {po.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(po.id, 'purchasing')}
                              className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded bg-blue-50"
                            >
                              采购中
                            </button>
                          )}
                          {po.status === 'purchasing' && (
                            <button
                              onClick={() => handleStatusChange(po.id, 'ordered')}
                              className="text-purple-600 hover:text-purple-900 px-3 py-1 rounded bg-purple-50"
                            >
                              已下单
                            </button>
                          )}
                          {po.status === 'ordered' && (
                            <button
                              onClick={() => handleStatusChange(po.id, 'arrived')}
                              className="text-green-600 hover:text-green-900 px-3 py-1 rounded bg-green-50"
                            >
                              已到货
                            </button>
                          )}
                          {po.status === 'arrived' && (
                            <button
                              onClick={() => handleReceive(po.id)}
                              className="text-white hover:bg-green-700 px-3 py-1 rounded bg-green-600"
                            >
                              入库并分配
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {purchaseOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无采购需求</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrders;