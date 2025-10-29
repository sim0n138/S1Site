/**
 * Типы активностей в приложении
 */
export type ActivityType = 'training' | 'stretching' | 'meditation';

/**
 * Базовый интерфейс для всех записей активности
 */
export interface BaseWellbeingLog {
  id: string;
  date: Date;
  notes?: string;
  activityType: ActivityType;
}

/**
 * Детали тренировки
 */
export interface TrainingDetails {
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number; // вес в кг
  }>;
  duration: number; // длительность в минутах
}

/**
 * Детали растяжки
 */
export interface StretchingDetails {
  poses: Array<{
    name: string;
    holdDuration: number; // длительность удержания в секундах
    targetMuscles: string[]; // целевые группы мышц
  }>;
  totalDuration: number; // общая длительность в минутах
}

/**
 * Детали медитации
 */
export interface MeditationDetails {
  type: 'mindfulness' | 'breathing' | 'visualization' | 'body-scan' | 'other';
  duration: number; // длительность в минутах
  technique?: string;
  guidedSession?: boolean;
}

/**
 * Запись о тренировке
 */
export interface TrainingLog extends BaseWellbeingLog {
  activityType: 'training';
  details: TrainingDetails;
}

/**
 * Запись о растяжке
 */
export interface StretchingLog extends BaseWellbeingLog {
  activityType: 'stretching';
  details: StretchingDetails;
}

/**
 * Запись о медитации
 */
export interface MeditationLog extends BaseWellbeingLog {
  activityType: 'meditation';
  details: MeditationDetails;
}

/**
 * Дискриминированное объединение всех типов активности
 */
export type WellbeingLog = TrainingLog | StretchingLog | MeditationLog;

/**
 * Статистика по активности
 */
export interface ActivityStats {
  totalSessions: number;
  totalDuration: number;
  lastSession?: Date;
}

/**
 * Сводная статистика
 */
export interface WellbeingStats {
  training: ActivityStats;
  stretching: ActivityStats;
  meditation: ActivityStats;
  totalActivities: number;
}
