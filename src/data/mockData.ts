import { Department, User, EquipmentType, Equipment, Request, Approval, Borrow, Repair, Inventory, InventoryCheck, PurchaseOrder, Log, BusinessRule, DashboardStats, MonthlyReport } from '../types';

export const departments: Department[] = [
  { id: 'd1', name: '技术部', code: 'TECH', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'd2', name: '产品部', code: 'PROD', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'd3', name: '市场部', code: 'MKT', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'd4', name: '财务部', code: 'FIN', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'd5', name: '人事部', code: 'HR', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'd6', name: '行政部', code: 'ADM', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const users: User[] = [
  { id: 'u1', name: '系统管理员', email: 'admin@company.com', role: 'admin', departmentId: 'd6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u2', name: '张三', email: 'zhangsan@company.com', role: 'it_staff', departmentId: 'd6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u3', name: '李四', email: 'lisi@company.com', role: 'department_admin', departmentId: 'd1', leaderId: 'u1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u4', name: '王五', email: 'wangwu@company.com', role: 'employee', departmentId: 'd1', leaderId: 'u3', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u5', name: '赵六', email: 'zhaoliu@company.com', role: 'employee', departmentId: 'd1', leaderId: 'u3', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u6', name: '钱七', email: 'qianqi@company.com', role: 'department_admin', departmentId: 'd2', leaderId: 'u1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u7', name: '孙八', email: 'sunba@company.com', role: 'employee', departmentId: 'd2', leaderId: 'u6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u8', name: '周九', email: 'zhoujiu@company.com', role: 'department_admin', departmentId: 'd3', leaderId: 'u1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u9', name: '吴十', email: 'wushi@company.com', role: 'employee', departmentId: 'd3', leaderId: 'u8', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'u10', name: '郑十一', email: 'zheng11@company.com', role: 'it_staff', departmentId: 'd6', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const equipmentTypes: EquipmentType[] = [
  { id: 'et1', name: 'MacBook Pro 14寸', category: '笔记本电脑', price: 14999, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'et2', name: 'ThinkPad X1 Carbon', category: '笔记本电脑', price: 12999, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'et3', name: 'Dell U2722D显示器', category: '显示器', price: 3299, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'et4', name: 'Logitech MX Master 3', category: '鼠标', price: 499, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'et5', name: 'Apple Magic Keyboard', category: '键盘', price: 899, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'et6', name: 'HP LaserJet Pro', category: '打印机', price: 1999, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'et7', name: 'iPad Pro 12.9寸', category: '平板', price: 8999, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'et8', name: 'iPhone 15 Pro', category: '手机', price: 7999, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const equipment: Equipment[] = [
  { id: 'e1', serialNumber: 'SN2024001', typeId: 'et1', status: 'assigned', location: '技术部工位', ownerId: 'u4', departmentId: 'd1', purchaseDate: '2024-03-15', purchasePrice: 14999, warrantyEnd: '2025-03-15', createdAt: '2024-03-15', updatedAt: '2024-03-20' },
  { id: 'e2', serialNumber: 'SN2024002', typeId: 'et1', status: 'assigned', location: '技术部工位', ownerId: 'u5', departmentId: 'd1', purchaseDate: '2024-03-15', purchasePrice: 14999, warrantyEnd: '2025-03-15', createdAt: '2024-03-15', updatedAt: '2024-03-20' },
  { id: 'e3', serialNumber: 'SN2024003', typeId: 'et2', status: 'assigned', location: '产品部工位', ownerId: 'u7', departmentId: 'd2', purchaseDate: '2024-04-01', purchasePrice: 12999, warrantyEnd: '2025-04-01', createdAt: '2024-04-01', updatedAt: '2024-04-05' },
  { id: 'e4', serialNumber: 'SN2024004', typeId: 'et3', status: 'assigned', location: '技术部工位', ownerId: 'u4', departmentId: 'd1', purchaseDate: '2024-03-20', purchasePrice: 3299, warrantyEnd: '2025-03-20', createdAt: '2024-03-20', updatedAt: '2024-03-25' },
  { id: 'e5', serialNumber: 'SN2024005', typeId: 'et3', status: 'in_stock', location: '仓库A区', purchaseDate: '2024-05-01', purchasePrice: 3299, warrantyEnd: '2025-05-01', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
  { id: 'e6', serialNumber: 'SN2024006', typeId: 'et4', status: 'in_stock', location: '仓库A区', purchaseDate: '2024-05-01', purchasePrice: 499, warrantyEnd: '2025-05-01', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
  { id: 'e7', serialNumber: 'SN2024007', typeId: 'et5', status: 'assigned', location: '技术部工位', ownerId: 'u4', departmentId: 'd1', purchaseDate: '2024-03-20', purchasePrice: 899, warrantyEnd: '2025-03-20', createdAt: '2024-03-20', updatedAt: '2024-03-25' },
  { id: 'e8', serialNumber: 'SN2024008', typeId: 'et6', status: 'assigned', location: '行政部办公室', departmentId: 'd6', purchaseDate: '2024-02-01', purchasePrice: 1999, warrantyEnd: '2025-02-01', createdAt: '2024-02-01', updatedAt: '2024-02-05' },
  { id: 'e9', serialNumber: 'SN2024009', typeId: 'et1', status: 'repairing', location: 'IT维修中心', purchaseDate: '2024-01-15', purchasePrice: 14999, warrantyEnd: '2025-01-15', createdAt: '2024-01-15', updatedAt: '2024-06-01' },
  { id: 'e10', serialNumber: 'SN2024010', typeId: 'et7', status: 'borrowed', location: '市场部工位', ownerId: 'u9', departmentId: 'd3', purchaseDate: '2024-04-15', purchasePrice: 8999, warrantyEnd: '2025-04-15', createdAt: '2024-04-15', updatedAt: '2024-06-10' },
  { id: 'e11', serialNumber: 'SN2024011', typeId: 'et2', status: 'in_stock', location: '仓库A区', purchaseDate: '2024-05-15', purchasePrice: 12999, warrantyEnd: '2025-05-15', createdAt: '2024-05-15', updatedAt: '2024-05-15' },
  { id: 'e12', serialNumber: 'SN2024012', typeId: 'et8', status: 'assigned', location: '技术部工位', ownerId: 'u5', departmentId: 'd1', purchaseDate: '2024-04-20', purchasePrice: 7999, warrantyEnd: '2025-04-20', createdAt: '2024-04-20', updatedAt: '2024-04-25' },
];

export const inventory: Inventory[] = [
  { id: 'i1', equipmentId: 'e5', quantity: 2, location: '仓库A区', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
  { id: 'i2', equipmentId: 'e6', quantity: 5, location: '仓库A区', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
  { id: 'i3', equipmentId: 'e11', quantity: 1, location: '仓库A区', createdAt: '2024-05-15', updatedAt: '2024-05-15' },
];

export const requests: Request[] = [
  { id: 'r1', userId: 'u5', equipmentTypeId: 'et3', quantity: 1, purpose: '新增显示器提高工作效率', totalAmount: 3299, status: 'pending', createdAt: '2024-06-15', updatedAt: '2024-06-15' },
  { id: 'r2', userId: 'u7', equipmentTypeId: 'et1', quantity: 1, purpose: '项目需要高性能笔记本', totalAmount: 14999, status: 'pending', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
  { id: 'r3', userId: 'u9', equipmentTypeId: 'et4', quantity: 1, purpose: '办公鼠标损坏更换', totalAmount: 499, status: 'approved', createdAt: '2024-06-13', updatedAt: '2024-06-14' },
  { id: 'r4', userId: 'u4', equipmentTypeId: 'et7', quantity: 1, purpose: '出差需要平板', totalAmount: 8999, status: 'allocated', createdAt: '2024-06-10', updatedAt: '2024-06-12' },
  { id: 'r5', userId: 'u5', equipmentTypeId: 'et2', quantity: 1, purpose: '备用笔记本', totalAmount: 12999, status: 'purchasing', createdAt: '2024-06-08', updatedAt: '2024-06-10' },
];

export const approvals: Approval[] = [
  { id: 'a1', requestId: 'r1', approverId: 'u3', status: 'pending', comment: '', createdAt: '2024-06-15', updatedAt: '2024-06-15' },
  { id: 'a2', requestId: 'r2', approverId: 'u6', status: 'pending', comment: '', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
  { id: 'a3', requestId: 'r2', approverId: 'u1', status: 'pending', comment: '', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
  { id: 'a4', requestId: 'r3', approverId: 'u8', status: 'approved', comment: '同意更换', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
];

export const borrows: Borrow[] = [
  { id: 'b1', userId: 'u9', equipmentId: 'e10', startDate: '2024-06-10', endDate: '2024-06-20', status: 'active', createdAt: '2024-06-10', updatedAt: '2024-06-10' },
  { id: 'b2', userId: 'u7', equipmentId: 'e8', startDate: '2024-06-01', endDate: '2024-06-07', actualReturnDate: '2024-06-07', status: 'returned', createdAt: '2024-06-01', updatedAt: '2024-06-07' },
  { id: 'b3', userId: 'u4', equipmentId: 'e5', startDate: '2024-05-20', endDate: '2024-06-03', status: 'overdue', createdAt: '2024-05-20', updatedAt: '2024-06-04' },
];

export const repairs: Repair[] = [
  { id: 'rp1', userId: 'u4', equipmentId: 'e9', technicianId: 'u2', description: '屏幕闪烁，需要更换屏幕', status: 'in_progress', priority: 'high', createdAt: '2024-06-01', updatedAt: '2024-06-05' },
  { id: 'rp2', userId: 'u5', equipmentId: 'e1', description: '键盘按键失灵', status: 'pending', priority: 'normal', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
  { id: 'rp3', userId: 'u7', equipmentId: 'e3', description: '电池续航时间短', status: 'assigned', technicianId: 'u10', priority: 'normal', createdAt: '2024-06-12', updatedAt: '2024-06-13' },
];

export const inventoryChecks: InventoryCheck[] = [
  { id: 'ic1', equipmentId: 'e1', checkDate: '2024-06-01', expectedQuantity: 1, actualQuantity: 1, status: 'completed', createdAt: '2024-06-01', updatedAt: '2024-06-05' },
  { id: 'ic2', equipmentId: 'e2', checkDate: '2024-06-01', expectedQuantity: 1, actualQuantity: 1, status: 'completed', createdAt: '2024-06-01', updatedAt: '2024-06-05' },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'po1', requestId: 'r5', equipmentTypeId: 'et2', quantity: 1, budgetAmount: 8000, status: 'ordered', createdAt: '2024-06-10', updatedAt: '2024-06-10' },
];

export const logs: Log[] = [
  { id: 'l1', userId: 'u1', action: 'CREATE', targetType: 'user', targetId: 'u5', detail: '创建用户王五', createdAt: '2024-06-15' },
  { id: 'l2', userId: 'u3', action: 'APPROVE', targetType: 'request', targetId: 'r3', detail: '审批通过设备申领单', createdAt: '2024-06-14' },
  { id: 'l3', userId: 'u2', action: 'ASSIGN', targetType: 'repair', targetId: 'rp1', detail: '分配维修工单', createdAt: '2024-06-05' },
];

export const businessRules: BusinessRule[] = [
  { id: 'br1', name: 'approval_threshold', value: 3000, description: '超过此金额需要部门总监审批' },
  { id: 'br2', name: 'borrow_reminder_days', value: 3, description: '借用到期前提醒天数' },
  { id: 'br3', name: 'borrow_overdue_days', value: 7, description: '超期多少天上报leader' },
  { id: 'br4', name: 'repair_timeout_hours', value: 24, description: '报修超时升级小时数' },
  { id: 'br5', name: 'inventory_diff_threshold', value: 2, description: '盘点差异超过此百分比需说明' },
];

export const dashboardStats: DashboardStats = {
  totalEquipment: 12,
  inStockEquipment: 3,
  assignedEquipment: 6,
  borrowedEquipment: 1,
  repairingEquipment: 1,
  scrappedEquipment: 1,
  totalUsers: 10,
  totalDepartments: 6,
  pendingRequests: 2,
  pendingApprovals: 3,
  pendingRepairs: 1,
  overdueBorrows: 1,
  equipmentByDepartment: [
    { departmentName: '技术部', count: 4 },
    { departmentName: '产品部', count: 2 },
    { departmentName: '市场部', count: 1 },
    { departmentName: '行政部', count: 2 },
    { departmentName: '财务部', count: 1 },
    { departmentName: '人事部', count: 2 },
  ],
  failureRateByDepartment: [
    { departmentName: '技术部', rate: 15 },
    { departmentName: '产品部', rate: 8 },
    { departmentName: '市场部', rate: 5 },
    { departmentName: '行政部', rate: 3 },
    { departmentName: '财务部', rate: 2 },
    { departmentName: '人事部', rate: 0 },
  ],
};

export const monthlyReports: MonthlyReport[] = [
  { month: '2024-01', totalValue: 150000, newPurchases: 5, scrappedEquipment: 0, averageAge: 12, repairCount: 3, borrowCount: 2 },
  { month: '2024-02', totalValue: 165000, newPurchases: 3, scrappedEquipment: 0, averageAge: 11, repairCount: 5, borrowCount: 4 },
  { month: '2024-03', totalValue: 185000, newPurchases: 6, scrappedEquipment: 1, averageAge: 10, repairCount: 4, borrowCount: 3 },
  { month: '2024-04', totalValue: 210000, newPurchases: 8, scrappedEquipment: 0, averageAge: 9, repairCount: 6, borrowCount: 5 },
  { month: '2024-05', totalValue: 225000, newPurchases: 4, scrappedEquipment: 0, averageAge: 8, repairCount: 8, borrowCount: 6 },
  { month: '2024-06', totalValue: 235000, newPurchases: 2, scrappedEquipment: 1, averageAge: 7, repairCount: 7, borrowCount: 4 },
];

export const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || '未知';
export const getUserName = (id: string) => users.find(u => u.id === id)?.name || '未知';
export const getEquipmentTypeName = (id: string) => equipmentTypes.find(t => t.id === id)?.name || '未知';
export const getEquipmentType = (id: string) => equipmentTypes.find(t => t.id === id);
export const getEquipment = (id: string) => equipment.find(e => e.id === id);
export const getUser = (id: string) => users.find(u => u.id === id);
export const getRequest = (id: string) => requests.find(r => r.id === id);
export const getApprovalThreshold = () => businessRules.find(r => r.name === 'approval_threshold')?.value || 3000;
export const getBorrowReminderDays = () => businessRules.find(r => r.name === 'borrow_reminder_days')?.value || 3;
export const getBorrowOverdueDays = () => businessRules.find(r => r.name === 'borrow_overdue_days')?.value || 7;
