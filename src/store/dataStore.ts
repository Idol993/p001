import { create } from 'zustand';
import { Equipment, Request, Approval, Borrow, Repair, Inventory, PurchaseOrder, Log, BusinessRule, InventoryCheck, User, EquipmentType, Department } from '../types';
import { equipment as initialEquipment, requests as initialRequests, approvals as initialApprovals, borrows as initialBorrows, repairs as initialRepairs, inventory as initialInventory, inventoryChecks as initialInventoryChecks, purchaseOrders as initialPurchaseOrders, logs as initialLogs, businessRules as initialBusinessRules, users as initialUsers, equipmentTypes as initialEquipmentTypes, departments as initialDepartments } from '../data/mockData';

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
  users: User[];
  equipmentTypes: EquipmentType[];
  departments: Department[];
  
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => { requestId: string };
  updateRequestStatus: (id: string, status: Request['status']) => void;
  
  addApproval: (approval: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApproval: (id: string, status: Approval['status'], comment: string) => void;
  handleApprovalAction: (requestId: string, approverId: string, status: Approval['status'], comment: string) => void;
  
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
  
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => void;
  receivePurchaseOrder: (id: string) => void;
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
  users: initialUsers,
  equipmentTypes: initialEquipmentTypes,
  departments: initialDepartments,
  
  addRequest: (request) => {
    const now = new Date().toISOString();
    const requestId = `r${Date.now()}`;
    const newRequest: Request = {
      ...request,
      id: requestId,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ requests: [...state.requests, newRequest] }));
    return { requestId };
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
  
  handleApprovalAction: (requestId, approverId, status, comment) => {
    set((state) => {
      const myApproval = state.approvals.find(a => a.requestId === requestId && a.approverId === approverId);
      if (!myApproval) return state;
      
      const updatedApprovals = state.approvals.map((a) =>
        a.id === myApproval.id ? { ...a, status, comment, updatedAt: new Date().toISOString() } : a
      );
      
      const allApprovals = updatedApprovals.filter(a => a.requestId === requestId);
      const allApproved = allApprovals.every(a => a.status === 'approved');
      const anyRejected = allApprovals.some(a => a.status === 'rejected');
      
      let requestStatus = state.requests.find(r => r.id === requestId)?.status || 'pending';
      
      if (anyRejected) {
        requestStatus = 'rejected';
      } else if (allApproved) {
        requestStatus = 'approved';
      }
      
      let updatedRequests = state.requests.map((r) =>
        r.id === requestId ? { ...r, status: requestStatus, updatedAt: new Date().toISOString() } : r
      );
      
      let updatedEquipment = [...state.equipment];
      let updatedInventory = [...state.inventory];
      let updatedPurchaseOrders = [...state.purchaseOrders];
      
      if (requestStatus === 'approved') {
        const request = updatedRequests.find(r => r.id === requestId);
        if (request) {
          const availableEquipment = updatedEquipment.filter(e => 
            e.typeId === request.equipmentTypeId && e.status === 'in_stock'
          );
          
          if (availableEquipment.length >= request.quantity) {
            const requester = request.userId;
            const allocatedIds: string[] = [];
            availableEquipment.slice(0, request.quantity).forEach((equip) => {
              allocatedIds.push(equip.id);
              updatedEquipment = updatedEquipment.map(e => 
                e.id === equip.id 
                  ? { ...e, status: 'assigned' as const, ownerId: requester, updatedAt: new Date().toISOString() }
                  : e
              );
            });
            updatedRequests = updatedRequests.map((r) =>
              r.id === requestId ? { ...r, status: 'allocated' as const, allocatedEquipmentIds: allocatedIds, updatedAt: new Date().toISOString() } : r
            );
          } else {
            const purchaseOrder: PurchaseOrder = {
              id: `po${Date.now()}`,
              requestId,
              equipmentTypeId: request.equipmentTypeId,
              quantity: request.quantity,
              budgetAmount: request.totalAmount,
              status: 'pending',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            updatedPurchaseOrders.push(purchaseOrder);
            updatedRequests = updatedRequests.map((r) =>
              r.id === requestId ? { ...r, status: 'purchasing' as const, updatedAt: new Date().toISOString() } : r
            );
          }
        }
      }
      
      return {
        approvals: updatedApprovals,
        requests: updatedRequests,
        equipment: updatedEquipment,
        inventory: updatedInventory,
        purchaseOrders: updatedPurchaseOrders,
      };
    });
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
  
  updatePurchaseOrderStatus: (id, status) => {
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id ? { ...po, status, updatedAt: new Date().toISOString() } : po
      ),
    }));
  },
  
  receivePurchaseOrder: (id) => {
    set((state) => {
      const purchaseOrder = state.purchaseOrders.find(po => po.id === id);
      if (!purchaseOrder || purchaseOrder.status !== 'arrived') return state;
      
      const request = state.requests.find(r => r.id === purchaseOrder.requestId);
      if (!request) return state;
      
      const batchId = `batch${Date.now()}`;
      const now = new Date().toISOString();
      const equipmentType = state.equipmentTypes?.find(et => et.id === purchaseOrder.equipmentTypeId);
      const requester = state.users?.find(u => u.id === request.userId);
      
      const newEquipmentList: Equipment[] = [];
      const newInventoryList: Inventory[] = [];
      const allocatedEquipmentIds: string[] = [];
      
      for (let i = 0; i < purchaseOrder.quantity; i++) {
        const equipmentId = `e${Date.now()}-${i}`;
        const serialNumber = equipmentType 
          ? `${equipmentType.name}-${Date.now()}-${String(i + 1).padStart(3, '0')}`
          : `EQ-${Date.now()}-${String(i + 1).padStart(3, '0')}`;
        
        allocatedEquipmentIds.push(equipmentId);
        
        newEquipmentList.push({
          id: equipmentId,
          serialNumber,
          typeId: purchaseOrder.equipmentTypeId,
          batchId,
          status: 'assigned' as const,
          ownerId: request.userId,
          departmentId: requester?.departmentId,
          location: `${state.departments?.find(d => d.id === requester?.departmentId)?.name || ''}工位`,
          purchaseDate: now,
          purchasePrice: equipmentType?.price || purchaseOrder.budgetAmount / purchaseOrder.quantity,
          warrantyEnd: '',
          createdAt: now,
          updatedAt: now,
        });
        
        newInventoryList.push({
          id: `i${Date.now()}-${i}`,
          equipmentId,
          quantity: 1,
          location: '仓库',
          createdAt: now,
          updatedAt: now,
        });
      }
      
      const updatedEquipment = [...state.equipment, ...newEquipmentList];
      const updatedInventory = [...state.inventory, ...newInventoryList];
      
      const updatedRequests = state.requests.map((r) =>
        r.id === request.id 
          ? { ...r, status: 'allocated' as const, allocatedEquipmentIds, updatedAt: now } 
          : r
      );
      
      return {
        equipment: updatedEquipment,
        inventory: updatedInventory,
        requests: updatedRequests,
        purchaseOrders: state.purchaseOrders.map((po) =>
          po.id === id ? { ...po, status: 'received' as const, updatedAt: now } : po
        ),
      };
    });
  },
}));
