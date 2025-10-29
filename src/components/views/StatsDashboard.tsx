import React, { useMemo } from 'react';
import { useWellbeingStore } from '../../store/wellbeingStore';
import { Card } from '../common';
import './StatsDashboard.css';

export const StatsDashboard: React.FC = () => {
  const logs = useWellbeingStore(state => state.logs);
  
  const stats = useMemo(() => {
    const calculateStats = (type: 'training' | 'stretching' | 'meditation') => {
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
    
    return {
      training: calculateStats('training'),
      stretching: calculateStats('stretching'),
      meditation: calculateStats('meditation'),
      totalActivities: logs.length,
    };
  }, [logs]);
  
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ч${mins > 0 ? ` ${mins} мин` : ''}`;
  };
  
  const formatLastSession = (date?: Date): string => {
    if (!date) return 'Нет данных';
    
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дн. назад`;
    
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };
  
  return (
    <div className="stats-dashboard">
      <Card title="📊 Общая статистика">
        <div className="stats-summary">
          <div className="stats-item stats-total">
            <div className="stats-value">{stats.totalActivities}</div>
            <div className="stats-label">Всего активностей</div>
          </div>
        </div>
      </Card>
      
      <div className="stats-grid">
        <Card>
          <div className="stats-card">
            <div className="stats-card-header">
              <span className="stats-icon">🏋️</span>
              <h3>Тренировки</h3>
            </div>
            <div className="stats-card-content">
              <div className="stats-metric">
                <span className="metric-value">{stats.training.totalSessions}</span>
                <span className="metric-label">сессий</span>
              </div>
              <div className="stats-metric">
                <span className="metric-value">{formatDuration(stats.training.totalDuration)}</span>
                <span className="metric-label">общее время</span>
              </div>
              <div className="stats-last-session">
                Последняя: {formatLastSession(stats.training.lastSession)}
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="stats-card">
            <div className="stats-card-header">
              <span className="stats-icon">🧘</span>
              <h3>Растяжка</h3>
            </div>
            <div className="stats-card-content">
              <div className="stats-metric">
                <span className="metric-value">{stats.stretching.totalSessions}</span>
                <span className="metric-label">сессий</span>
              </div>
              <div className="stats-metric">
                <span className="metric-value">{formatDuration(stats.stretching.totalDuration)}</span>
                <span className="metric-label">общее время</span>
              </div>
              <div className="stats-last-session">
                Последняя: {formatLastSession(stats.stretching.lastSession)}
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="stats-card">
            <div className="stats-card-header">
              <span className="stats-icon">🧘‍♀️</span>
              <h3>Медитация</h3>
            </div>
            <div className="stats-card-content">
              <div className="stats-metric">
                <span className="metric-value">{stats.meditation.totalSessions}</span>
                <span className="metric-label">сессий</span>
              </div>
              <div className="stats-metric">
                <span className="metric-value">{formatDuration(stats.meditation.totalDuration)}</span>
                <span className="metric-label">общее время</span>
              </div>
              <div className="stats-last-session">
                Последняя: {formatLastSession(stats.meditation.lastSession)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
