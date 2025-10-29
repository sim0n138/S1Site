import React from 'react';
import { useWellbeingStore } from '../../store/wellbeingStore';
import { Card, Button } from '../common';
import type { WellbeingLog } from '../../types/activity';
import './ActivityList.css';

export const ActivityList: React.FC = () => {
  const logs = useWellbeingStore(state => state.logs);
  const removeLog = useWellbeingStore(state => state.removeLog);
  
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'training':
        return '🏋️';
      case 'stretching':
        return '🧘';
      case 'meditation':
        return '🧘‍♀️';
      default:
        return '✨';
    }
  };
  
  const getActivityLabel = (type: string): string => {
    switch (type) {
      case 'training':
        return 'Тренировка';
      case 'stretching':
        return 'Растяжка';
      case 'meditation':
        return 'Медитация';
      default:
        return 'Активность';
    }
  };
  
  const renderDetails = (log: WellbeingLog) => {
    if (log.activityType === 'training') {
      return (
        <div className="activity-details">
          <p><strong>Длительность:</strong> {log.details.duration} мин</p>
          <p><strong>Упражнения:</strong></p>
          <ul>
            {log.details.exercises.map((ex, i) => (
              <li key={i}>
                {ex.name} - {ex.sets} x {ex.reps}
                {ex.weight && ` (${ex.weight} кг)`}
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (log.activityType === 'stretching') {
      return (
        <div className="activity-details">
          <p><strong>Длительность:</strong> {log.details.totalDuration} мин</p>
          <p><strong>Позы:</strong></p>
          <ul>
            {log.details.poses.map((pose, i) => (
              <li key={i}>
                {pose.name} - {pose.holdDuration} сек
                {pose.targetMuscles.length > 0 && ` (${pose.targetMuscles.join(', ')})`}
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (log.activityType === 'meditation') {
      const typeLabels = {
        'mindfulness': 'Осознанность',
        'breathing': 'Дыхательная практика',
        'visualization': 'Визуализация',
        'body-scan': 'Сканирование тела',
        'other': 'Другое',
      };
      
      return (
        <div className="activity-details">
          <p><strong>Тип:</strong> {typeLabels[log.details.type]}</p>
          <p><strong>Длительность:</strong> {log.details.duration} мин</p>
          {log.details.technique && (
            <p><strong>Техника:</strong> {log.details.technique}</p>
          )}
          {log.details.guidedSession && (
            <p><strong>Управляемая сессия:</strong> Да</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  const handleRemove = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      removeLog(id);
    }
  };
  
  if (sortedLogs.length === 0) {
    return (
      <Card title="История активностей">
        <p className="empty-state">
          Пока нет записей. Добавьте свою первую активность!
        </p>
      </Card>
    );
  }
  
  return (
    <Card title="История активностей">
      <div className="activity-list">
        {sortedLogs.map(log => (
          <div key={log.id} className="activity-item">
            <div className="activity-header">
              <div className="activity-type">
                <span className="activity-icon">{getActivityIcon(log.activityType)}</span>
                <span className="activity-label">{getActivityLabel(log.activityType)}</span>
              </div>
              <span className="activity-date">{formatDate(log.date)}</span>
            </div>
            
            {renderDetails(log)}
            
            {log.notes && (
              <div className="activity-notes">
                <strong>Заметки:</strong> {log.notes}
              </div>
            )}
            
            <div className="activity-actions">
              <Button 
                variant="danger" 
                size="small"
                onClick={() => handleRemove(log.id)}
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
