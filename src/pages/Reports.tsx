import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { equipment, equipmentTypes, departments, users, getEquipmentTypeName, getDepartmentName, getUserName, monthlyReports } from '../data/mockData';
import { BarChart3, Download, Filter, Calendar, TrendingUp, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Area } from 'recharts';
import * as XLSX from 'xlsx';

export default function Reports() {
  const { requests, borrows, repairs } = useDataStore();
  
  const [filters, setFilters] = useState({
    departmentId: '',
    userId: '',
    equipmentTypeId: '',
    startDate: '',
    endDate: '',
  });

  const handleExport = () => {
    const exportData = equipment.map(e => ({
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

  const generateMonthlyReport = () => {
    return monthlyReports;
  };

  const getTotalAssetValue = () => {
    return equipment.reduce((sum, e) => sum + e.purchasePrice, 0);
  };

  const getDepartmentAssetValue = () => {
    return departments.map(d => ({
      departmentName: d.name,
      value: equipment
        .filter(e => e.departmentId === d.id)
        .reduce((sum, e) => sum + e.purchasePrice, 0),
    }));
  };

  const reportData = generateMonthlyReport();
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
              <p className="text-sm text-gray-500">本月申领</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{requests.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">本月借用</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{borrows.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">本月报修</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{repairs.length}</p>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-4">月度报表详情</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">月份</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">资产总值</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">新增采购</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">报废设备</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均使用年限(月)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">维修次数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">借用次数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportData.map((report) => (
                <tr key={report.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{report.month}</td>
                  <td className="px-6 py-4 text-gray-600">¥{report.totalValue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{report.newPurchases}</td>
                  <td className="px-6 py-4 text-gray-600">{report.scrappedEquipment}</td>
                  <td className="px-6 py-4 text-gray-600">{report.averageAge}</td>
                  <td className="px-6 py-4 text-gray-600">{report.repairCount}</td>
                  <td className="px-6 py-4 text-gray-600">{report.borrowCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
