import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { businessRules, departments, equipmentTypes, users, getDepartmentName } from '../data/mockData';
import { Settings as SettingsIcon, Shield, Users, Package, AlertTriangle, Clock, Wrench, ClipboardList, Plus, Trash2, Save } from 'lucide-react';

export default function Settings() {
  const { businessRules: rules, updateBusinessRule } = useDataStore();
  
  const [activeTab, setActiveTab] = useState<'rules' | 'users' | 'equipmentTypes'>('rules');
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [ruleValue, setRuleValue] = useState('');

  const handleSaveRule = (ruleId: string) => {
    updateBusinessRule(ruleId, parseInt(ruleValue) || 0);
    setEditingRule(null);
    setRuleValue('');
  };

  const tabs = [
    { key: 'rules', label: '业务规则', icon: Shield },
    { key: 'users', label: '用户管理', icon: Users },
    { key: 'equipmentTypes', label: '设备类型', icon: Package },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-800">系统设置</h1>
      </div>

      <div className="card">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">业务规则配置</h2>
              {rules.map((rule) => (
                <div key={rule.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rule.name === 'approval_threshold' && <AlertTriangle className="w-5 h-5 text-warning" />}
                      {rule.name === 'borrow_reminder_days' && <Clock className="w-5 h-5 text-blue-500" />}
                      {rule.name === 'borrow_overdue_days' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {rule.name === 'repair_timeout_hours' && <Wrench className="w-5 h-5 text-orange-500" />}
                      {rule.name === 'inventory_diff_threshold' && <ClipboardList className="w-5 h-5 text-purple-500" />}
                      <div>
                        <p className="font-medium text-gray-800">
                          {rule.name === 'approval_threshold' && '审批阈值'}
                          {rule.name === 'borrow_reminder_days' && '借用提醒天数'}
                          {rule.name === 'borrow_overdue_days' && '借用超期天数'}
                          {rule.name === 'repair_timeout_hours' && '报修超时小时数'}
                          {rule.name === 'inventory_diff_threshold' && '盘点差异阈值'}
                        </p>
                        <p className="text-sm text-gray-500">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {editingRule === rule.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={ruleValue}
                            onChange={(e) => setRuleValue(e.target.value)}
                            className="input w-24"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRule(rule.id)}
                            className="btn-primary"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingRule(null);
                              setRuleValue('');
                            }}
                            className="btn-secondary"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-800">{rule.value}</span>
                          <button
                            onClick={() => {
                              setEditingRule(rule.id);
                              setRuleValue(rule.value.toString());
                            }}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            编辑
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">用户列表</h2>
                <button className="btn-primary">
                  <Plus className="w-4 h-4" />
                  添加用户
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">姓名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">邮箱</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">部门</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">角色</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-gray-600">{getDepartmentName(user.departmentId)}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${
                            user.role === 'admin' ? 'badge-danger' :
                            user.role === 'it_staff' ? 'badge-info' :
                            user.role === 'department_admin' ? 'badge-warning' : 'badge-default'
                          }`}>
                            {user.role === 'admin' && '管理员'}
                            {user.role === 'it_staff' && 'IT运维'}
                            {user.role === 'department_admin' && '部门行政'}
                            {user.role === 'employee' && '普通员工'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
                          <button className="text-red-600 hover:text-red-800 text-sm ml-3">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'equipmentTypes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">设备类型</h2>
                <button className="btn-primary">
                  <Plus className="w-4 h-4" />
                  添加类型
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipmentTypes.map((type) => (
                  <div key={type.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{type.name}</p>
                        <p className="text-sm text-gray-500">{type.category}</p>
                      </div>
                      <p className="text-lg font-bold text-primary-600">¥{type.price.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button className="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}