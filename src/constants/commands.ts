import type { QuickCommand, Category } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'daily', name: 'Ежедневные', icon: '☀️', order: 0 },
  { id: 'work', name: 'Работа', icon: '💼', order: 1 },
  { id: 'home', name: 'Дом', icon: '🏠', order: 2 },
  { id: 'health', name: 'Здоровье', icon: '❤️', order: 3 },
  { id: 'personal', name: 'Личное', icon: '👤', order: 4 },
];

export const DEFAULT_COMMANDS: QuickCommand[] = [
  {
    id: 'cmd_vitamins',
    icon: '💊',
    name: 'Выпить витамины',
    categoryId: 'daily',
    timeOptions: [
      { type: 'absolute', value: '09:00', label: '09:00' },
      { type: 'absolute', value: '14:00', label: '14:00' },
      { type: 'absolute', value: '21:00', label: '21:00' },
    ],
    createdAt: Date.now(),
    usageCount: 0,
  },
  {
    id: 'cmd_water',
    icon: '💧',
    name: 'Выпить воду',
    categoryId: 'daily',
    timeOptions: [
      { type: 'relative', value: 30, label: '+30 мин' },
      { type: 'relative', value: 60, label: '+1 ч' },
      { type: 'relative', value: 120, label: '+2 ч' },
    ],
    createdAt: Date.now(),
    usageCount: 0,
  },
  {
    id: 'cmd_call',
    icon: '📞',
    name: 'Позвонить',
    categoryId: 'work',
    timeOptions: [
      { type: 'relative', value: 15, label: '+15 мин' },
      { type: 'relative', value: 30, label: '+30 мин' },
      { type: 'relative', value: 60, label: '+1 ч' },
    ],
    createdAt: Date.now(),
    usageCount: 0,
  },
  {
    id: 'cmd_email',
    icon: '📧',
    name: 'Проверить почту',
    categoryId: 'work',
    timeOptions: [
      { type: 'relative', value: 60, label: '+1 ч' },
      { type: 'relative', value: 120, label: '+2 ч' },
      { type: 'absolute', value: '17:00', label: '17:00' },
    ],
    createdAt: Date.now(),
    usageCount: 0,
  },
  {
    id: 'cmd_laundry',
    icon: '🧺',
    name: 'Проверить стиралку',
    categoryId: 'home',
    timeOptions: [
      { type: 'relative', value: 30, label: '+30 мин' },
      { type: 'relative', value: 45, label: '+45 мин' },
      { type: 'relative', value: 60, label: '+1 ч' },
    ],
    createdAt: Date.now(),
    usageCount: 0,
  },
  {
    id: 'cmd_exercise',
    icon: '🏃',
    name: 'Тренировка',
    categoryId: 'health',
    timeOptions: [
      { type: 'absolute', value: '07:00', label: '07:00' },
      { type: 'absolute', value: '18:00', label: '18:00' },
      { type: 'absolute', value: '20:00', label: '20:00' },
    ],
    createdAt: Date.now(),
    usageCount: 0,
  },
];

// Emoji options for command creation
export const EMOJI_OPTIONS = [
  // Row 1 - Daily
  '💊', '💧', '☕', '🍳', '🌅', '🌙', '⏰', '📖',
  // Row 2 - Work
  '📞', '📧', '💼', '📝', '💻', '📊', '🎯', '✅',
  // Row 3 - Home
  '🧺', '🍽️', '🧹', '🛒', '🚗', '🏠', '🔑', '📦',
  // Row 4 - Health
  '🏃', '🧘', '💪', '🥗', '😴', '❤️', '🩺', '💆',
  // Row 5 - Personal
  '📚', '🎮', '🎬', '🎵', '✨', '🎂', '🎁', '💝',
  // Row 6 - Misc
  '🔔', '⭐', '💡', '🚀', '🌟', '🎉', '👋', '🙏',
];

// Quick time options for capture screen
export const QUICK_TIME_OPTIONS = [
  { minutes: 5, label: '5 мин' },
  { minutes: 15, label: '15 мин' },
  { minutes: 30, label: '30 мин' },
  { minutes: 60, label: '1 ч' },
] as const;
