import { create } from 'zustand';
import { User, UserRole } from '../types';
import { users } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (role: UserRole) => boolean;
  getPermissionLevel: () => number;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: (email: string, password: string) => {
    const user = users.find(u => u.email === email && password === 'password');
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  hasPermission: (role: UserRole) => {
    const { user } = get();
    if (!user) return false;
    
    const permissionLevels: Record<UserRole, number> = {
      employee: 1,
      department_admin: 2,
      it_staff: 3,
      admin: 4,
    };
    
    const requiredLevel = permissionLevels[role];
    const userLevel = permissionLevels[user.role];
    
    return userLevel >= requiredLevel;
  },
  
  getPermissionLevel: () => {
    const { user } = get();
    if (!user) return 0;
    
    const permissionLevels: Record<UserRole, number> = {
      employee: 1,
      department_admin: 2,
      it_staff: 3,
      admin: 4,
    };
    
    return permissionLevels[user.role];
  },
}));
