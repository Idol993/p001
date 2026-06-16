import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { equipment, equipmentTypes, getEquipmentTypeName, getDepartmentName } from '../data/mockData';
import { ClipboardList, CheckCircle, AlertTriangle, FileText, RefreshCw } from 'lucide-react';

export default function InventoryCheck() {
  const { inventoryChecks } = useDataStore();
  
  const [showModal, setShowModal] = useState(false);
  const [checkData, setCheckData] = useState({
    checkDate: new Date().toISOString().split('T')[0],
  });

  const completedChecks = inventoryChecks.filter(c => c.status === 'completed');
  const pendingChecks = inventoryChecks.filter(c => c.status === 'pending');

  const generateCheckData = () => {
    return equipment.map(e => ({
      id: e.id,
      name: getEquipmentTypeName(e.typeId),
      serialNumber: e.serialNumber,
      expectedQuantity: 1,
      actualQuantity: 1,
      status: 'pending' as const,
    }));
  };

  const handleStartCheck = () => {
    setShowModal(false);
  };

  const calculateDifference = () => {
    const total = equipment.length;
    const matched = Math.floor(total * 0.95);
    const unmatched = total - matched;
    const differenceRate = ((unmatched / total) * 100).toFixed(1);
    return { total, matched, unmatched, differenceRate };
  };

  const difference = calculateDifference();
  const requiresExplanation = parseFloat(difference.differenceRate) > 2;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">资产盘点</h1>
          <p className="text-gray-500 mt-1">定期盘点资产，确保账实相符</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <ClipboardList className="w-5 h-5" />
          发起盘点
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">设备总数</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{difference.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">账实相符</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{difference.matched}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">账实不符</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{difference.unmatched}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">差异率</p>
              <p className={`text-2xl font-bold mt-1 ${requiresExplanation ? 'text-red-600' : 'text-success'}`}>
                {difference.differenceRate}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${requiresExplanation ? 'bg-red-100' : 'bg-green-100'}`}>
              <FileText className={`w-6 h-6 ${requiresExplanation ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {requiresExplanation && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-medium text-red-800">盘点差异超过2%</p>
            <p className="text-sm text-red-600">请各部门提交书面说明，解释差异原因</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary-600" />
              当前盘点
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto scrollbar-thin">
            {generateCheckData().map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">SN: {item.serialNumber}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">账面数量</p>
                      <p className="font-semibold text-gray-800">{item.expectedQuantity}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">实际数量</p>
                      <input
                        type="number"
                        defaultValue={item.actualQuantity}
                        className="input w-20 text-center"
                      />
                    </div>
                    <button className="btn-success text-sm">
                      <CheckCircle className="w-4 h-4" />
                      确认
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-success" />
              历史盘点记录
            </h2>
            <span className="badge-default">{completedChecks.length}次</span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto scrollbar-thin">
            {completedChecks.map((check) => {
              const equip = equipment.find(e => e.id === check.equipmentId);
              return (
                <div key={check.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{getEquipmentTypeName(equip?.typeId || '')}</p>
                      <p className="text-sm text-gray-500">盘点日期: {check.checkDate}</p>
                    </div>
                    <span className="badge-success">已完成</span>
                  </div>
                  <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    <span>账面: {check.expectedQuantity}</span>
                    <span>实际: {check.actualQuantity}</span>
                    <span className={check.expectedQuantity === check.actualQuantity ? 'text-green-600' : 'text-orange-600'}>
                      差异: {check.expectedQuantity - check.actualQuantity}
                    </span>
                  </div>
                </div>
              );
            })}
            {completedChecks.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无历史盘点记录</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">发起资产盘点</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">盘点日期</label>
                <input
                  type="date"
                  value={checkData.checkDate}
                  onChange={(e) => setCheckData({ checkDate: e.target.value })}
                  className="input"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">盘点范围</p>
                <p className="font-medium text-gray-800 mt-1">全公司所有设备 ({equipment.length}件)</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button type="button" onClick={handleStartCheck} className="btn-primary flex-1">
                <ClipboardList className="w-4 h-4" />
                开始盘点
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
