import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  WellbeingLog, 
  ActivityType, 
  WellbeingStats, 
  ActivityStats 
} from '../types/activity';

interface WellbeingStore {
  logs: WellbeingLog[];
  
  // Действия
  addLog: (log: Omit<WellbeingLog, 'id'>) => void;
  removeLog: (id: string) => void;
  updateLog: (id: string, log: Partial<WellbeingLog>) => void;
}

/**
 * Селектор для получения логов по типу
 */
export const selectLogsByType = (type: ActivityType) => (state: WellbeingStore) => 
  state.logs.filter(log => log.activityType === type);

/**
 * Селектор для получения статистики по типу активности
 */
export const selectActivityStats = (type: ActivityType) => (state: WellbeingStore) => 
  calculateActivityStats(state.logs, type);

/**
 * Селектор для получения общей статистики
 */
export const selectStats = (state: WellbeingStore): WellbeingStats => ({
  training: calculateActivityStats(state.logs, 'training'),
  stretching: calculateActivityStats(state.logs, 'stretching'),
  meditation: calculateActivityStats(state.logs, 'meditation'),
  totalActivities: state.logs.length,
});

/**
 * Генерация уникального ID для записи
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Валидация записи перед сохранением
 */
const validateLog = (log: Omit<WellbeingLog, 'id'>): boolean => {
  if (!log.activityType || !log.date) {
    return false;
  }
  
  if (!log.details) {
    return false;
  }
  
  // Дополнительная валидация в зависимости от типа
  switch (log.activityType) {
    case 'training':
      return 'exercises' in log.details && log.details.exercises && log.details.exercises.length > 0;
    case 'stretching':
      return 'poses' in log.details && log.details.poses && log.details.poses.length > 0;
    case 'meditation':
      return 'duration' in log.details && log.details.duration > 0;
    default:
      return false;
  }
};

/**
 * Расчет статистики для конкретного типа активности
 */
const calculateActivityStats = (logs: WellbeingLog[], type: ActivityType): ActivityStats => {
  const filteredLogs = logs.filter(log => log.activityType === type);
  
  if (filteredLogs.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
    };
  }
  
  const totalDuration = filteredLogs.reduce((sum, log) => {
    if (log.activityType === 'training') {
      return sum + log.details.duration;
    } else if (log.activityType === 'stretching') {
      return sum + log.details.totalDuration;
    } else if (log.activityType === 'meditation') {
      return sum + log.details.duration;
    }
    return sum;
  }, 0);
  
  const sortedLogs = [...filteredLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return {
    totalSessions: filteredLogs.length,
    totalDuration,
    lastSession: new Date(sortedLogs[0].date),
  };
};

/**
 * Хранилище Zustand с поддержкой персистентности
 */
export const useWellbeingStore = create<WellbeingStore>()(
  persist(
    (set) => ({
      logs: [],
      
      addLog: (log) => {
        try {
          if (!validateLog(log)) {
            console.error('Invalid log data:', log);
            throw new Error('Invalid log data');
          }
          
          const newLog: WellbeingLog = {
            ...log,
            id: generateId(),
          } as WellbeingLog;
          
          set((state) => ({
            logs: [...state.logs, newLog],
          }));
        } catch (error) {
          console.error('Error adding log:', error);
          throw error;
        }
      },
      
      removeLog: (id) => {
        set((state) => ({
          logs: state.logs.filter(log => log.id !== id),
        }));
      },
      
      updateLog: (id, updatedData) => {
        set((state) => ({
          logs: state.logs.map(log => 
            log.id === id ? { ...log, ...updatedData } as WellbeingLog : log
          ),
        }));
      },
    }),
    {
      name: 'wellbeing-storage',
    }
  )
);
