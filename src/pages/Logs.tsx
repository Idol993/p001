import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { getUserName, getEquipmentTypeName, getDepartmentName } from '../data/mockData';
import { FileText, Search, Calendar, User, Activity } from 'lucide-react';

export default function Logs() {
  const { logs } = useDataStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const actions = ['CREATE', 'APPROVE', 'REJECT', 'ASSIGN', 'COMPLETE', 'RETURN', 'UPDATE', 'DELETE'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getUserName(log.userId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !filterAction || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE: '创建',
      APPROVE: '审批通过',
      REJECT: '审批驳回',
      ASSIGN: '分配',
      COMPLETE: '完成',
      RETURN: '归还',
      UPDATE: '更新',
      DELETE: '删除',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-600',
      APPROVE: 'bg-blue-100 text-blue-600',
      REJECT: 'bg-red-100 text-red-600',
      ASSIGN: 'bg-yellow-100 text-yellow-600',
      COMPLETE: 'bg-purple-100 text-purple-600',
      RETURN: 'bg-teal-100 text-teal-600',
      UPDATE: 'bg-gray-100 text-gray-600',
      DELETE: 'bg-orange-100 text-orange-600',
    };
    return colors[action] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">操作日志</h1>
          <p className="text-gray-500 mt-1">查看系统关键操作记录</p>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索操作描述或操作人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="w-48">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="select"
            >
              <option value="">全部操作类型</option>
              {actions.map((action) => (
                <option key={action} value={action}>{getActionLabel(action)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">目标类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作详情</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-800">{getUserName(log.userId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{log.targetType}</td>
                  <td className="px-6 py-4 text-gray-600">{log.detail}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(log.createdAt).toLocaleString('zh-CN')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">暂无操作日志</p>
          </div>
        )}
      </div>
    </div>
  );
}
