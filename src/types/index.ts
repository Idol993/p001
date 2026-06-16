export type UserRole = 'employee' | 'department_admin' | 'it_staff' | 'admin';

export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  leaderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentType {
  id: string;
  name: string;
  category: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  serialNumber: string;
  typeId: string;
  batchId?: string;
  status: 'in_stock' | 'assigned' | 'borrowed' | 'repairing' | 'scrapped';
  location: string;
  ownerId?: string;
  departmentId?: string;
  purchaseDate: string;
  purchasePrice: number;
  warrantyEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  equipmentId: string;
  quantity: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  userId: string;
  equipmentTypeId: string;
  quantity: number;
  purpose: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'allocated' | 'purchasing';
  allocatedEquipmentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  requestId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Borrow {
  id: string;
  userId: string;
  equipmentId: string;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface Repair {
  id: string;
  userId: string;
  equipmentId: string;
  technicianId?: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCheck {
  id: string;
  equipmentId: string;
  checkDate: string;
  expectedQuantity: number;
  actualQuantity: number;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  requestId: string;
  equipmentTypeId: string;
  quantity: number;
  budgetAmount: number;
  status: 'pending' | 'purchasing' | 'ordered' | 'arrived' | 'received';
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  id: string;
  userId: string;
  action: string;
  targetType: string;
  targetId?: string;
  detail: string;
  createdAt: string;
}

export interface BusinessRule {
  id: string;
  name: string;
  value: number;
  description: string;
}

export interface DashboardStats {
  totalEquipment: number;
  inStockEquipment: number;
  assignedEquipment: number;
  borrowedEquipment: number;
  repairingEquipment: number;
  scrappedEquipment: number;
  totalUsers: number;
  totalDepartments: number;
  pendingRequests: number;
  pendingApprovals: number;
  pendingRepairs: number;
  overdueBorrows: number;
  equipmentByDepartment: { departmentName: string; count: number }[];
  failureRateByDepartment: { departmentName: string; rate: number }[];
}

export interface MonthlyReport {
  month: string;
  totalValue: number;
  newPurchases: number;
  scrappedEquipment: number;
  averageAge: number;
  repairCount: number;
  borrowCount: number;
}
