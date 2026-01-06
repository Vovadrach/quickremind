import type { Achievement } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  // First steps
  {
    id: 'first_capture',
    icon: '🌱',
    name: 'First Capture',
    description: 'Зловили першу думку',
    cpReward: 5,
    condition: { type: 'totalCaptured', value: 1 },
  },
  {
    id: 'speed_demon',
    icon: '⚡',
    name: 'Speed Demon',
    description: 'Створили нагадування за 3 секунди',
    cpReward: 10,
    condition: { type: 'speedCapture', value: 3 },
  },

  // Streaks
  {
    id: 'week_warrior',
    icon: '🔥',
    name: 'Week Warrior',
    description: '7-денний streak',
    cpReward: 25,
    condition: { type: 'streak', value: 7 },
  },
  {
    id: 'two_weeks',
    icon: '💪',
    name: 'Two Weeks Strong',
    description: '14-денний streak',
    cpReward: 50,
    condition: { type: 'streak', value: 14 },
  },
  {
    id: 'month_master',
    icon: '🏆',
    name: 'Month Master',
    description: '30-денний streak',
    cpReward: 100,
    condition: { type: 'streak', value: 30 },
  },

  // Completion
  {
    id: 'precision_10',
    icon: '🎯',
    name: 'Precision',
    description: '10 нагадувань виконано вчасно',
    cpReward: 15,
    condition: { type: 'totalCompleted', value: 10 },
  },
  {
    id: 'precision_50',
    icon: '🎯',
    name: 'Sharp Shooter',
    description: '50 нагадувань виконано вчасно',
    cpReward: 30,
    condition: { type: 'totalCompleted', value: 50 },
  },
  {
    id: 'precision_100',
    icon: '🎯',
    name: 'Bullseye Master',
    description: '100 нагадувань виконано вчасно',
    cpReward: 50,
    condition: { type: 'totalCompleted', value: 100 },
  },

  // Volume
  {
    id: 'mind_organizer_50',
    icon: '🧠',
    name: 'Mind Organizer',
    description: '50 думок зафіксовано',
    cpReward: 20,
    condition: { type: 'totalCaptured', value: 50 },
  },
  {
    id: 'mind_organizer_100',
    icon: '🧠',
    name: 'Thought Collector',
    description: '100 думок зафіксовано',
    cpReward: 40,
    condition: { type: 'totalCaptured', value: 100 },
  },
  {
    id: 'mind_organizer_500',
    icon: '🧠',
    name: 'Memory Master',
    description: '500 думок зафіксовано',
    cpReward: 100,
    condition: { type: 'totalCaptured', value: 500 },
  },

  // Commands
  {
    id: 'command_creator_5',
    icon: '⌨️',
    name: 'Command Creator',
    description: 'Створили 5 швидких команд',
    cpReward: 20,
    condition: { type: 'commandsCreated', value: 5 },
  },
  {
    id: 'command_creator_10',
    icon: '⌨️',
    name: 'Automation Pro',
    description: 'Створили 10 швидких команд',
    cpReward: 40,
    condition: { type: 'commandsCreated', value: 10 },
  },

  // Daily CP
  {
    id: 'superstar',
    icon: '🌟',
    name: 'Superstar',
    description: '100 CP за один день',
    cpReward: 50,
    condition: { type: 'dailyCP', value: 100 },
  },

  // Total CP
  {
    id: 'cp_500',
    icon: '💎',
    name: 'Rising Star',
    description: 'Зібрали 500 CP',
    cpReward: 25,
    condition: { type: 'totalCP', value: 500 },
  },
  {
    id: 'cp_1000',
    icon: '💎',
    name: 'Shining Gem',
    description: 'Зібрали 1000 CP',
    cpReward: 50,
    condition: { type: 'totalCP', value: 1000 },
  },
  {
    id: 'cp_5000',
    icon: '💎',
    name: 'Diamond Mind',
    description: 'Зібрали 5000 CP',
    cpReward: 100,
    condition: { type: 'totalCP', value: 5000 },
  },
];

// CP rewards for actions
export const CP_REWARDS = {
  createReminder: 1,
  completeReminder: 2,
  completeOnTime: 3,   // bonus for completing within ±5 min
  streak7: 10,
  streak14: 25,
  streak30: 50,
  useQuickCommand: 1,
  createQuickCommand: 5,
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
  10000,  // Level 11+
] as const;

export const LEVEL_NAMES = [
  'Новачок',
  'Учень',
  'Організатор',
  'Фокусник',
  'Mind Catcher',
  'Thought Master',
  'Focus Pro',
  'Memory Guru',
  'Time Lord',
  'Zen Master',
] as const;
