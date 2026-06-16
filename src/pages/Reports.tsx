import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { equipmentTypes, departments, users, getEquipmentTypeName, getDepartmentName, getUserName, monthlyReports } from '../data/mockData';
import { BarChart3, Download, Filter, Calendar, TrendingUp, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Area } from 'recharts';
import * as XLSX from 'xlsx';

export default function Reports() {
  const { requests, borrows, repairs, equipment } = useDataStore();
  
  const [filters, setFilters] = useState({
    departmentId: '',
    userId: '',
    equipmentTypeId: '',
    startDate: '',
    endDate: '',
  });

  const filteredEquipment = equipment.filter(e => {
    if (filters.departmentId && e.departmentId !== filters.departmentId) return false;
    if (filters.userId && e.ownerId !== filters.userId) return false;
    if (filters.equipmentTypeId && e.typeId !== filters.equipmentTypeId) return false;
    if (filters.startDate && e.purchaseDate < filters.startDate) return false;
    if (filters.endDate && e.purchaseDate > filters.endDate) return false;
    return true;
  });

  const filteredRequests = requests.filter(r => {
    const requester = users.find(u => u.id === r.userId);
    if (filters.departmentId && requester?.departmentId !== filters.departmentId) return false;
    if (filters.userId && r.userId !== filters.userId) return false;
    if (filters.equipmentTypeId && r.equipmentTypeId !== filters.equipmentTypeId) return false;
    if (filters.startDate && r.createdAt < filters.startDate) return false;
    if (filters.endDate && r.createdAt > filters.endDate) return false;
    return true;
  });

  const filteredBorrows = borrows.filter(b => {
    const borrower = users.find(u => u.id === b.userId);
    if (filters.departmentId && borrower?.departmentId !== filters.departmentId) return false;
    if (filters.userId && b.userId !== filters.userId) return false;
    return true;
  });

  const filteredRepairs = repairs.filter(r => {
    const requester = users.find(u => u.id === r.userId);
    if (filters.departmentId && requester?.departmentId !== filters.departmentId) return false;
    if (filters.userId && r.userId !== filters.userId) return false;
    return true;
  });

  const handleExport = () => {
    const exportData = filteredEquipment.map(e => ({
      '设备名称': getEquipmentTypeName(e.typeId),
      '序列号': e.serialNumber,
      '状态': e.status === 'in_stock' ? '库存中' : e.status === 'assigned' ? '已分配' : e.status === 'borrowed' ? '借用中' : e.status === 'repairing' ? '维修中' : '已报废',
      '使用人': e.ownerId ? getUserName(e.ownerId) : '-',
      '部门': e.departmentId ? getDepartmentName(e.departmentId) : '-',
      '采购日期': e.purchaseDate,
      '采购价格': e.purchasePrice,
      '保修截止': e.warrantyEnd || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '设备资产报表');
    XLSX.writeFile(workbook, `设备资产报表_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getTotalAssetValue = () => {
    return filteredEquipment.reduce((sum, e) => sum + e.purchasePrice, 0);
  };

  const getDepartmentAssetValue = () => {
    return departments
      .filter(d => !filters.departmentId || d.id === filters.departmentId)
      .map(d => ({
        departmentName: d.name,
        value: filteredEquipment
          .filter(e => e.departmentId === d.id)
          .reduce((sum, e) => sum + e.purchasePrice, 0),
      }))
      .filter(d => d.value > 0);
  };

  const reportData = monthlyReports;
  const departmentValueData = getDepartmentAssetValue();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">报表中心</h1>
          <p className="text-gray-500 mt-1">查看资产统计报表和导出数据</p>
        </div>
        <button onClick={handleExport} className="btn-primary">
          <Download className="w-5 h-5" />
          导出Excel
        </button>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600" />
          筛选条件
        </h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
            <select
              value={filters.departmentId}
              onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
              className="select"
            >
              <option value="">全部部门</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">使用人</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="select"
            >
              <option value="">全部人员</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">设备类型</label>
            <select
              value={filters.equipmentTypeId}
              onChange={(e) => setFilters({ ...filters, equipmentTypeId: e.target.value })}
              className="select"
            >
              <option value="">全部类型</option>
              {equipmentTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input"
            />
          </div>
        </div>
        <button
          onClick={() => setFilters({ departmentId: '', userId: '', equipmentTypeId: '', startDate: '', endDate: '' })}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          清空筛选条件
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">资产总值</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">¥{getTotalAssetValue().toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">申领数量</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{filteredRequests.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">借用数量</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{filteredBorrows.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">报修数量</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{filteredRepairs.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">月度资产总值趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, '资产总值']} />
                <Area type="monotone" dataKey="totalValue" stroke="#3b82f6" fill="#eff6ff" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">部门资产价值分布</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentValueData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="departmentName" width={60} />
                <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, '资产价值']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">设备列表</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">序列号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">使用人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">部门</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">采购价格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">采购日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEquipment.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{getEquipmentTypeName(e.typeId)}</td>
                  <td className="px-6 py-4 text-gray-600">{e.serialNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      e.status === 'in_stock' ? 'badge-success' :
                      e.status === 'assigned' ? 'badge-info' :
                      e.status === 'borrowed' ? 'badge-warning' :
                      e.status === 'repairing' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {e.status === 'in_stock' ? '库存中' :
                       e.status === 'assigned' ? '已分配' :
                       e.status === 'borrowed' ? '借用中' :
                       e.status === 'repairing' ? '维修中' : '已报废'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{e.ownerId ? getUserName(e.ownerId) : '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{e.departmentId ? getDepartmentName(e.departmentId) : '-'}</td>
                  <td className="px-6 py-4 text-gray-600">¥{e.purchasePrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{e.purchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEquipment.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>没有符合条件的设备</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}