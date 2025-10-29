import React, { useState } from 'react';
import { useWellbeingStore } from '../../store/wellbeingStore';
import { Button, Input, TextArea, Select, Card } from '../common';
import type { 
  ActivityType, 
  TrainingLog,
  StretchingLog,
  MeditationLog,
} from '../../types/activity';
import './ActivityForm.css';

export const ActivityForm: React.FC = () => {
  const addLog = useWellbeingStore(state => state.addLog);
  
  const [activityType, setActivityType] = useState<ActivityType>('training');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  
  // Training state
  const [trainingExercises, setTrainingExercises] = useState<Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }>>([{ name: '', sets: 1, reps: 1 }]);
  const [trainingDuration, setTrainingDuration] = useState<number>(30);
  
  // Stretching state
  const [stretchingPoses, setStretchingPoses] = useState<Array<{
    name: string;
    holdDuration: number;
    targetMuscles: string[];
  }>>([{ name: '', holdDuration: 30, targetMuscles: [] }]);
  const [stretchingDuration, setStretchingDuration] = useState<number>(15);
  
  // Meditation state
  const [meditationType, setMeditationType] = useState<'mindfulness' | 'breathing' | 'visualization' | 'body-scan' | 'other'>('mindfulness');
  const [meditationDuration, setMeditationDuration] = useState<number>(10);
  const [meditationTechnique, setMeditationTechnique] = useState<string>('');
  const [guidedSession, setGuidedSession] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activityType === 'training') {
        const trainingLog: Omit<TrainingLog, 'id'> = {
          activityType: 'training',
          date: new Date(date),
          notes: notes || undefined,
          details: {
            exercises: trainingExercises.filter(ex => ex.name.trim() !== ''),
            duration: trainingDuration,
          },
        };
        addLog(trainingLog);
      } else if (activityType === 'stretching') {
        const stretchingLog: Omit<StretchingLog, 'id'> = {
          activityType: 'stretching',
          date: new Date(date),
          notes: notes || undefined,
          details: {
            poses: stretchingPoses.filter(pose => pose.name.trim() !== ''),
            totalDuration: stretchingDuration,
          },
        };
        addLog(stretchingLog);
      } else {
        const meditationLog: Omit<MeditationLog, 'id'> = {
          activityType: 'meditation',
          date: new Date(date),
          notes: notes || undefined,
          details: {
            type: meditationType,
            duration: meditationDuration,
            technique: meditationTechnique || undefined,
            guidedSession,
          },
        };
        addLog(meditationLog);
      }
      
      // Reset form
      resetForm();
      alert('Активность успешно добавлена!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ошибка при добавлении активности. Проверьте данные.');
    }
  };
  
  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setTrainingExercises([{ name: '', sets: 1, reps: 1 }]);
    setTrainingDuration(30);
    setStretchingPoses([{ name: '', holdDuration: 30, targetMuscles: [] }]);
    setStretchingDuration(15);
    setMeditationDuration(10);
    setMeditationTechnique('');
    setGuidedSession(false);
  };
  
  const addExercise = () => {
    setTrainingExercises([...trainingExercises, { name: '', sets: 1, reps: 1 }]);
  };
  
  const removeExercise = (index: number) => {
    setTrainingExercises(trainingExercises.filter((_, i) => i !== index));
  };
  
  const updateExercise = (index: number, field: string, value: string | number | undefined) => {
    const updated = [...trainingExercises];
    updated[index] = { ...updated[index], [field]: value };
    setTrainingExercises(updated);
  };
  
  const addPose = () => {
    setStretchingPoses([...stretchingPoses, { name: '', holdDuration: 30, targetMuscles: [] }]);
  };
  
  const removePose = (index: number) => {
    setStretchingPoses(stretchingPoses.filter((_, i) => i !== index));
  };
  
  const updatePose = (index: number, field: string, value: string | number | string[]) => {
    const updated = [...stretchingPoses];
    updated[index] = { ...updated[index], [field]: value };
    setStretchingPoses(updated);
  };
  
  return (
    <Card title="Добавить активность">
      <form onSubmit={handleSubmit} className="activity-form">
        <Select
          label="Тип активности"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value as ActivityType)}
          options={[
            { value: 'training', label: '🏋️ Тренировка' },
            { value: 'stretching', label: '🧘 Растяжка' },
            { value: 'meditation', label: '🧘‍♀️ Медитация' },
          ]}
        />
        
        <Input
          label="Дата"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        
        {activityType === 'training' && (
          <div className="activity-specific-fields">
            <h4>Упражнения</h4>
            {trainingExercises.map((exercise, index) => (
              <div key={index} className="exercise-item">
                <Input
                  label="Название упражнения"
                  value={exercise.name}
                  onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  placeholder="Например: Приседания"
                  required
                />
                <div className="exercise-row">
                  <Input
                    label="Подходы"
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                  <Input
                    label="Повторения"
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                  <Input
                    label="Вес (кг)"
                    type="number"
                    value={exercise.weight || ''}
                    onChange={(e) => updateExercise(index, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                    min="0"
                    step="0.5"
                  />
                </div>
                {trainingExercises.length > 1 && (
                  <Button 
                    type="button" 
                    variant="danger" 
                    size="small"
                    onClick={() => removeExercise(index)}
                  >
                    Удалить упражнение
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addExercise}>
              + Добавить упражнение
            </Button>
            
            <Input
              label="Длительность тренировки (мин)"
              type="number"
              value={trainingDuration}
              onChange={(e) => setTrainingDuration(parseInt(e.target.value) || 1)}
              min="1"
              required
            />
          </div>
        )}
        
        {activityType === 'stretching' && (
          <div className="activity-specific-fields">
            <h4>Позы и растяжка</h4>
            {stretchingPoses.map((pose, index) => (
              <div key={index} className="pose-item">
                <Input
                  label="Название позы"
                  value={pose.name}
                  onChange={(e) => updatePose(index, 'name', e.target.value)}
                  placeholder="Например: Собака мордой вниз"
                  required
                />
                <Input
                  label="Длительность удержания (сек)"
                  type="number"
                  value={pose.holdDuration}
                  onChange={(e) => updatePose(index, 'holdDuration', parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
                <Input
                  label="Целевые мышцы (через запятую)"
                  value={pose.targetMuscles.join(', ')}
                  onChange={(e) => updatePose(index, 'targetMuscles', e.target.value.split(',').map(m => m.trim()))}
                  placeholder="Например: спина, ноги"
                />
                {stretchingPoses.length > 1 && (
                  <Button 
                    type="button" 
                    variant="danger" 
                    size="small"
                    onClick={() => removePose(index)}
                  >
                    Удалить позу
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addPose}>
              + Добавить позу
            </Button>
            
            <Input
              label="Общая длительность (мин)"
              type="number"
              value={stretchingDuration}
              onChange={(e) => setStretchingDuration(parseInt(e.target.value) || 1)}
              min="1"
              required
            />
          </div>
        )}
        
        {activityType === 'meditation' && (
          <div className="activity-specific-fields">
            <Select
              label="Тип медитации"
              value={meditationType}
              onChange={(e) => setMeditationType(e.target.value as 'mindfulness' | 'breathing' | 'visualization' | 'body-scan' | 'other')}
              options={[
                { value: 'mindfulness', label: 'Осознанность' },
                { value: 'breathing', label: 'Дыхательная практика' },
                { value: 'visualization', label: 'Визуализация' },
                { value: 'body-scan', label: 'Сканирование тела' },
                { value: 'other', label: 'Другое' },
              ]}
            />
            
            <Input
              label="Длительность (мин)"
              type="number"
              value={meditationDuration}
              onChange={(e) => setMeditationDuration(parseInt(e.target.value) || 1)}
              min="1"
              required
            />
            
            <Input
              label="Техника (опционально)"
              value={meditationTechnique}
              onChange={(e) => setMeditationTechnique(e.target.value)}
              placeholder="Например: 4-7-8 дыхание"
            />
            
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="guided"
                checked={guidedSession}
                onChange={(e) => setGuidedSession(e.target.checked)}
              />
              <label htmlFor="guided">Управляемая сессия</label>
            </div>
          </div>
        )}
        
        <TextArea
          label="Заметки (опционально)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Дополнительные заметки о сессии..."
        />
        
        <div className="form-actions">
          <Button type="submit" variant="primary" size="large">
            Добавить активность
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            Очистить
          </Button>
        </div>
      </form>
    </Card>
  );
};
