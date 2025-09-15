import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';

export interface AppState {
  // User state
  user: User | null;
  isAdmin: boolean;
  
  // UI state
  isLoading: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Application state
  unreadNotifications: number;
  lastSyncTime: number | null;
  
  // Performance state
  networkStatus: 'online' | 'offline';
  lastError: string | null;
}

export interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Application actions
  setUnreadNotifications: (count: number) => void;
  updateLastSyncTime: () => void;
  
  // Performance actions
  setNetworkStatus: (status: 'online' | 'offline') => void;
  setLastError: (error: string | null) => void;
  
  // Utility actions
  reset: () => void;
}

export type AppStore = AppState & AppActions;

const initialState: AppState = {
  user: null,
  isAdmin: false,
  isLoading: false,
  sidebarOpen: false,
  theme: 'system',
  unreadNotifications: 0,
  lastSyncTime: null,
  networkStatus: 'online',
  lastError: null,
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // User actions
        setUser: (user) => set({ user }, false, 'setUser'),
        setIsAdmin: (isAdmin) => set({ isAdmin }, false, 'setIsAdmin'),
        
        // UI actions
        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }, false, 'setSidebarOpen'),
        setTheme: (theme) => set({ theme }, false, 'setTheme'),
        
        // Application actions
        setUnreadNotifications: (unreadNotifications) => set({ unreadNotifications }, false, 'setUnreadNotifications'),
        updateLastSyncTime: () => set({ lastSyncTime: Date.now() }, false, 'updateLastSyncTime'),
        
        // Performance actions
        setNetworkStatus: (networkStatus) => set({ networkStatus }, false, 'setNetworkStatus'),
        setLastError: (lastError) => set({ lastError }, false, 'setLastError'),
        
        // Utility actions
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'xuedao-app-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'XueDAO App Store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// Selectors for optimized re-renders
export const useUser = () => useAppStore((state) => state.user);
export const useIsAdmin = () => useAppStore((state) => state.isAdmin);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useTheme = () => useAppStore((state) => state.theme);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useUnreadNotifications = () => useAppStore((state) => state.unreadNotifications);
export const useNetworkStatus = () => useAppStore((state) => state.networkStatus);
export const useLastError = () => useAppStore((state) => state.lastError);

// Compound selectors for complex state
export const useUserInfo = () => useAppStore((state) => ({
  user: state.user,
  isAdmin: state.isAdmin,
}));

export const useUIState = () => useAppStore((state) => ({
  isLoading: state.isLoading,
  sidebarOpen: state.sidebarOpen,
  theme: state.theme,
}));

export const useAppStatus = () => useAppStore((state) => ({
  unreadNotifications: state.unreadNotifications,
  lastSyncTime: state.lastSyncTime,
  networkStatus: state.networkStatus,
  lastError: state.lastError,
}));