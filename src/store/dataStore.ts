import { create } from 'zustand';
import { Equipment, Request, Approval, Borrow, Repair, Inventory, PurchaseOrder, Log, BusinessRule, InventoryCheck } from '../types';
import { equipment as initialEquipment, requests as initialRequests, approvals as initialApprovals, borrows as initialBorrows, repairs as initialRepairs, inventory as initialInventory, inventoryChecks as initialInventoryChecks, purchaseOrders as initialPurchaseOrders, logs as initialLogs, businessRules as initialBusinessRules } from '../data/mockData';

interface DataState {
  equipment: Equipment[];
  requests: Request[];
  approvals: Approval[];
  borrows: Borrow[];
  repairs: Repair[];
  inventory: Inventory[];
  inventoryChecks: InventoryCheck[];
  purchaseOrders: PurchaseOrder[];
  logs: Log[];
  businessRules: BusinessRule[];
  
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequestStatus: (id: string, status: Request['status']) => void;
  
  addApproval: (approval: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApproval: (id: string, status: Approval['status'], comment: string) => void;
  
  addBorrow: (borrow: Omit<Borrow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  returnBorrow: (id: string) => void;
  
  addRepair: (repair: Omit<Repair, 'id' | 'createdAt' | 'updatedAt'>) => void;
  assignRepair: (id: string, technicianId: string) => void;
  completeRepair: (id: string) => void;
  
  addInventory: (item: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInventory: (id: string, quantity: number) => void;
  
  addEquipment: (equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  
  addLog: (log: Omit<Log, 'id' | 'createdAt'>) => void;
  
  updateBusinessRule: (id: string, value: number) => void;
}

export const useDataStore = create<DataState>((set) => ({
  equipment: initialEquipment,
  requests: initialRequests,
  approvals: initialApprovals,
  borrows: initialBorrows,
  repairs: initialRepairs,
  inventory: initialInventory,
  inventoryChecks: initialInventoryChecks,
  purchaseOrders: initialPurchaseOrders,
  logs: initialLogs,
  businessRules: initialBusinessRules,
  
  addRequest: (request) => {
    const now = new Date().toISOString();
    const newRequest: Request = {
      ...request,
      id: `r${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ requests: [...state.requests, newRequest] }));
  },
  
  updateRequestStatus: (id, status) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));
  },
  
  addApproval: (approval) => {
    const now = new Date().toISOString();
    const newApproval: Approval = {
      ...approval,
      id: `a${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ approvals: [...state.approvals, newApproval] }));
  },
  
  updateApproval: (id, status, comment) => {
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.id === id ? { ...a, status, comment, updatedAt: new Date().toISOString() } : a
      ),
    }));
  },
  
  addBorrow: (borrow) => {
    const now = new Date().toISOString();
    const newBorrow: Borrow = {
      ...borrow,
      id: `b${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ borrows: [...state.borrows, newBorrow] }));
  },
  
  returnBorrow: (id) => {
    set((state) => ({
      borrows: state.borrows.map((b) =>
        b.id === id
          ? { ...b, status: 'returned' as const, actualReturnDate: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : b
      ),
    }));
  },
  
  addRepair: (repair) => {
    const now = new Date().toISOString();
    const newRepair: Repair = {
      ...repair,
      id: `rp${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ repairs: [...state.repairs, newRepair] }));
  },
  
  assignRepair: (id, technicianId) => {
    set((state) => ({
      repairs: state.repairs.map((r) =>
        r.id === id
          ? { ...r, technicianId, status: 'assigned' as const, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
  },
  
  completeRepair: (id) => {
    set((state) => ({
      repairs: state.repairs.map((r) =>
        r.id === id
          ? { ...r, status: 'completed' as const, updatedAt: new Date().toISOString() }
          : r
      ),
    }));
  },
  
  addInventory: (item) => {
    const now = new Date().toISOString();
    const newItem: Inventory = {
      ...item,
      id: `i${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ inventory: [...state.inventory, newItem] }));
  },
  
  updateInventory: (id, quantity) => {
    set((state) => ({
      inventory: state.inventory.map((i) =>
        i.id === id ? { ...i, quantity, updatedAt: new Date().toISOString() } : i
      ),
    }));
  },
  
  addEquipment: (equipment) => {
    const now = new Date().toISOString();
    const newEquipment: Equipment = {
      ...equipment,
      id: `e${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ equipment: [...state.equipment, newEquipment] }));
  },
  
  updateEquipment: (id, updates) => {
    set((state) => ({
      equipment: state.equipment.map((e) =>
        e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
      ),
    }));
  },
  
  addLog: (log) => {
    const now = new Date().toISOString();
    const newLog: Log = {
      ...log,
      id: `l${Date.now()}`,
      createdAt: now,
    };
    set((state) => ({ logs: [...state.logs, newLog] }));
  },
  
  updateBusinessRule: (id, value) => {
    set((state) => ({
      businessRules: state.businessRules.map((r) =>
        r.id === id ? { ...r, value } : r
      ),
    }));
  },
}));
