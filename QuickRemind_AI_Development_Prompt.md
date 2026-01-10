# QuickRemind — AI Development Prompt

> Цей документ є повним технічним завданням для AI-агента, який буде розробляти мобільний застосунок QuickRemind. Документ містить всю необхідну інформацію для повної реалізації продукту.

---

## 📋 Зміст

1. [Запит користувача](#запит-користувача)
2. [Бачення продукту](#бачення-продукту)
3. [Дизайн-концепція](#дизайн-концепція)
4. [Архітектура інтерфейсу](#архітектура-інтерфейсу)
5. [Функціональна специфікація](#функціональна-специфікація)
6. [Технічна архітектура](#технічна-архітектура)
7. [Детальні User Flows](#детальні-user-flows)
8. [Компоненти UI](#компоненти-ui)
9. [Анімації та мікро-взаємодії](#анімації-та-мікро-взаємодії)
10. [Обробка станів](#обробка-станів)
11. [Структура файлів проекту](#структура-файлів-проекту)
12. [Оновлення реалізації (v2 web)](#оновлення-реалізації-v2-web)

---

## Запит користувача

### Оригінальний запит (голос користувача)

```
Я хочу простий застосунок для швидких нагадувань. Мене дратує, що в стандартних 
нагадуваннях на телефоні потрібно робити купу кліків: відкрити застосунок, 
натиснути плюс, ввести текст, обрати дату, обрати час, зберегти...

Мені потрібно просто: відкрив — тапнув "через 30 хвилин" — закрив. Все.

Коли я ставлю пральну машину, мені не потрібен календар. Мені потрібно 
"нагадай через 40 хвилин". Коли я готую — "нагадай через 25 хвилин виключити 
духовку". Коли я на роботі — "зателефонуй клієнту через годину".

Застосунок повинен бути таким простим, щоб навіть моя бабуся могла ним 
користуватися. Великі кнопки, жодних меню, жодних налаштувань. 
Відкрив — тапнув — готово.

Я не хочу реєструватися, не хочу синхронізацію, не хочу категорії. 
Просто швидке нагадування і все.
```

### Сформульована проблема

**Pain Point:** Створення простого нагадування "через X хвилин" займає 15-20 секунд та 6-10 тапів у стандартних застосунках.

**Solution:** Застосунок, який дозволяє створити нагадування за 2-3 секунди та 1-2 тапи.

**Core Value Proposition:** "Нагадування за один тап"

---

## Бачення продукту

### Місія

Зробити створення нагадувань настільки швидким і простим, що це стане природною частиною будь-якої дії — як погляд на годинник.

### Ключові принципи

| Принцип | Опис | Як реалізувати |
|---------|------|----------------|
| **Одна задача** | Застосунок робить тільки одну річ | Жодних додаткових функцій |
| **Нульове навчання** | Зрозуміло за 3 секунди | Великі підписані кнопки |
| **Миттєва дія** | Результат за 1-2 тапи | Немає підтверджень, модалок |
| **Комфорт використання** | Можна тапати однією рукою | Touch targets мінімум 56px |
| **Без тертя** | Жодних перешкод | Без реєстрації, налаштувань |

### Цільова аудиторія

- Люди 25-55 років
- Зайняті професіонали
- Батьки з дітьми
- Всі, хто готує вдома
- Люди, які цінують простоту

### Метрика успіху

**Час від відкриття до створення нагадування < 3 секунди** для 90% сценаріїв.

---

## Дизайн-концепція

### Філософія дизайну: "Calm Technology"

Застосунок повинен бути **тихим помічником** — не привертати зайвої уваги, не відволікати, не змушувати думати. Він з'являється, виконує свою роботу і зникає.

### Візуальний стиль: "Soft Minimal"

```
Не холодний мінімалізм Apple → М'який, теплий мінімалізм
Не Material Design з тінями → Плоский з м'якими переходами
Не яскраві акценти → Спокійна, приглушена палітра
Не геометрична строгість → Округлі, дружні форми
```

### Кольорова палітра

```css
/* Основні кольори */
--background-primary: #FAFBFC;      /* Майже білий з теплим відтінком */
--background-secondary: #F3F4F6;    /* Світло-сірий для карток */
--background-elevated: #FFFFFF;      /* Білий для кнопок */

/* Текст */
--text-primary: #1F2937;            /* Темно-сірий, не чорний */
--text-secondary: #6B7280;          /* Середньо-сірий */
--text-tertiary: #9CA3AF;           /* Світло-сірий для підказок */

/* Акценти */
--accent-primary: #3B82F6;          /* Спокійний синій */
--accent-success: #10B981;          /* М'який зелений */
--accent-warning: #F59E0B;          /* Теплий жовтий */
--accent-danger: #EF4444;           /* Для видалення */

/* Тіні — м'які, ледь помітні */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);

/* Border radius — завжди округлі */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

### Типографіка

```css
/* Шрифт: SF Pro (iOS) / Roboto (Android) — системний */
/* Це забезпечує нативний вигляд та швидке завантаження */

--font-size-xs: 12px;      /* Мітки часу */
--font-size-sm: 14px;      /* Вторинний текст */
--font-size-base: 16px;    /* Основний текст */
--font-size-lg: 18px;      /* Підзаголовки */
--font-size-xl: 20px;      /* Текст на кнопках часу */
--font-size-2xl: 24px;     /* Заголовки секцій */
--font-size-3xl: 32px;     /* Великий час на таймері */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Принципи spacing (8px grid)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Ключові візуальні характеристики

1. **Багато "повітря"** — елементи не притиснуті один до одного
2. **М'які тіні** — ледь помітні, створюють глибину без драматизму
3. **Округлі кути** — всюди, мінімум 8px, кнопки 12-16px
4. **Контрастні, але не кричущі** — текст читається легко
5. **Відсутність borders** — розділення через колір та простір
6. **Консистентність** — однакові відступи, розміри, радіуси

---

## Архітектура інтерфейсу

### Структура єдиного екрану

```
┌─────────────────────────────────────┐
│         STATUS BAR (system)         │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │  ← ЗОНА 1: Input Zone
│  │     Про що нагадати?        │   │     (15% висоти)
│  │     [текстове поле]         │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────┐  ┌───────────┐      │  ← ЗОНА 2: Quick Buttons
│  │           │  │           │      │     (50% висоти)
│  │   5 хв    │  │   15 хв   │      │
│  │           │  │           │      │
│  └───────────┘  └───────────┘      │
│                                     │
│  ┌───────────┐  ┌───────────┐      │
│  │           │  │           │      │
│  │   30 хв   │  │   1 год   │      │
│  │           │  │           │      │
│  └───────────┘  └───────────┘      │
│                                     │
│  ┌───────────┐  ┌───────────┐      │
│  │           │  │           │      │
│  │   2 год   │  │ Свій час  │      │
│  │           │  │           │      │
│  └───────────┘  └───────────┘      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Активні нагадування (2)           │  ← ЗОНА 3: Active Reminders
│                                     │     (35% висоти)
│  ┌─────────────────────────────┐   │
│  │ 🔔 Перевір пральку    23:45 │   │
│  │    залишилось 24 хв         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔔 Зателефонуй...     00:30 │   │
│  │    залишилось 1 год 12 хв   │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Детальний опис зон

#### ЗОНА 1: Input Zone (Текстове поле)

```
Розташування: Top, 15% screen height
Padding: 16px horizontal, 12px vertical
```

**Компонент: TextInput**
- Placeholder: "Про що нагадати?" (колір: text-tertiary)
- Background: background-secondary
- Border radius: 12px
- Height: 48px
- Font size: 16px
- Max length: 50 characters
- Character counter: показується тільки коли > 40 символів
- Clear button: з'являється коли є текст

**Поведінка:**
- Фокус відкриває клавіатуру
- Клавіатура НЕ перекриває кнопки часу
- Enter/Done закриває клавіатуру
- Поле опціональне — можна створити нагадування без тексту

#### ЗОНА 2: Quick Buttons (Кнопки швидкого вибору)

```
Розташування: Center, 50% screen height
Grid: 2 columns × 3 rows
Gap: 12px
Padding: 16px horizontal
```

**Компонент: TimeButton**
- Width: (screen_width - 32 - 12) / 2
- Height: рівний для всіх, розраховується динамічно
- Min height: 80px
- Background: background-elevated
- Border radius: 16px
- Shadow: shadow-md

**Вміст кнопки:**
```
┌─────────────────┐
│                 │
│     5 хв        │  ← Основний текст (font-size-xl, font-weight-semibold)
│                 │
│   через 5 хв    │  ← Підтекст (font-size-sm, text-secondary)
│                 │
└─────────────────┘
```

**Стани кнопки:**
- Default: background-elevated, shadow-md
- Pressed: scale(0.97), shadow-sm, background-secondary
- Disabled: opacity 0.5 (коли досягнуто ліміт нагадувань)

**Кнопка "Свій час":**
- Іконка годинника замість тексту часу
- При тапі відкриває Time Picker (bottom sheet)

#### ЗОНА 3: Active Reminders (Активні нагадування)

```
Розташування: Bottom, 35% screen height
Padding: 16px horizontal
```

**Заголовок секції:**
- Текст: "Активні нагадування (N)" де N — кількість
- Font: font-size-sm, font-weight-medium, text-secondary
- Margin bottom: 8px

**Компонент: ReminderCard**
```
┌─────────────────────────────────────────┐
│                                         │
│  🔔  Перевір пральку              23:45 │
│      залишилось 24 хв                   │
│                                         │
└─────────────────────────────────────────┘
```

**Структура:**
- Height: 72px
- Background: background-elevated
- Border radius: 12px
- Shadow: shadow-sm
- Padding: 16px
- Margin bottom: 8px

**Елементи:**
- Іконка дзвоника (20px, accent-primary)
- Текст нагадування або "Нагадування" якщо текст порожній
- Час спрацювання (справа, font-size-sm, text-secondary)
- Countdown (залишилось X хв/год, font-size-xs, text-tertiary)

**Інтеракції:**
- Swipe left → показує кнопку "Видалити" (червона)
- Swipe right → показує кнопку "Редагувати час" (синя)
- Long press → haptic feedback + контекстне меню

**Порожній стан:**
```
┌─────────────────────────────────────────┐
│                                         │
│            🔔                           │
│                                         │
│      Немає активних нагадувань          │
│                                         │
│    Оберіть час вище, щоб створити       │
│                                         │
└─────────────────────────────────────────┘
```

---

## Функціональна специфікація

### Core Features (MVP)

| ID | Feature | Опис | Priority |
|----|---------|------|----------|
| F1 | Quick time buttons | 6 кнопок: 5хв, 15хв, 30хв, 1год, 2год, Custom | P0 |
| F2 | Custom time picker | Bottom sheet з вибором годин/хвилин | P0 |
| F3 | Reminder text | Опціональний текст до 50 символів | P0 |
| F4 | Local notifications | Push notification коли час настав | P0 |
| F5 | Active reminders list | Список поточних (макс 5) | P0 |
| F6 | Delete reminder | Swipe to delete | P0 |
| F7 | Countdown display | Показ часу, що залишився | P1 |
| F8 | Haptic feedback | Вібрація при створенні/видаленні | P1 |

### Anti-Features (свідомо НЕ реалізуємо)

- ❌ Реєстрація / акаунт
- ❌ Синхронізація між пристроями
- ❌ Категорії / теги / кольори
- ❌ Повторювані нагадування
- ❌ Історія нагадувань
- ❌ Налаштування / меню
- ❌ Онбординг / туторіал
- ❌ Dark mode (в MVP)
- ❌ Віджети (в MVP)
- ❌ Siri / Google Assistant інтеграція (в MVP)

### Ліміти

| Параметр | Значення | Причина |
|----------|----------|---------|
| Max active reminders | 5 | Простота, фокус |
| Max text length | 50 chars | Поміщається в нотифікацію |
| Max custom time | 24 години | Це не календар |
| Min custom time | 1 хвилина | Практичний мінімум |

---

## Технічна архітектура

### Технологічний стек

```yaml
Framework: React Native with Expo (SDK 50+)
Language: TypeScript
State Management: Zustand (lightweight, simple)
Storage: AsyncStorage (local, no backend)
Notifications: expo-notifications
Navigation: Не потрібна (single screen)
Styling: StyleSheet (native) + constants
```

### Структура даних

```typescript
// types/reminder.ts

interface Reminder {
  id: string;                    // UUID v4
  text: string | null;           // Опціональний текст (max 50 chars)
  targetTime: number;            // Unix timestamp (milliseconds)
  createdAt: number;             // Unix timestamp
  notificationId: string;        // ID scheduled notification
}

interface AppState {
  reminders: Reminder[];
  isLoading: boolean;
}

// Приклад
const reminder: Reminder = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  text: "Перевір пральку",
  targetTime: 1704067200000,     // 2024-01-01 00:00:00
  createdAt: 1704063600000,      // 2024-01-01 23:00:00
  notificationId: "notif_123"
};
```

### Store (Zustand)

```typescript
// store/reminderStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReminderStore {
  reminders: Reminder[];
  
  // Actions
  addReminder: (text: string | null, minutes: number) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  clearExpired: () => void;
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],
      
      addReminder: async (text, minutes) => {
        const targetTime = Date.now() + minutes * 60 * 1000;
        const id = generateUUID();
        
        // Schedule notification
        const notificationId = await scheduleNotification({
          title: text || 'Нагадування',
          body: 'Час настав!',
          trigger: { date: new Date(targetTime) },
        });
        
        const reminder: Reminder = {
          id,
          text,
          targetTime,
          createdAt: Date.now(),
          notificationId,
        };
        
        set(state => ({
          reminders: [...state.reminders, reminder].slice(-5) // Max 5
        }));
      },
      
      removeReminder: async (id) => {
        const reminder = get().reminders.find(r => r.id === id);
        if (reminder) {
          await cancelNotification(reminder.notificationId);
        }
        set(state => ({
          reminders: state.reminders.filter(r => r.id !== id)
        }));
      },
      
      clearExpired: () => {
        const now = Date.now();
        set(state => ({
          reminders: state.reminders.filter(r => r.targetTime > now)
        }));
      },
    }),
    {
      name: 'quickremind-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Notifications Service

```typescript
// services/notifications.ts

import * as Notifications from 'expo-notifications';

// Конфігурація
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleNotification(
  title: string,
  body: string,
  triggerDate: Date
): Promise<string> {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: {
      date: triggerDate,
    },
  });
  return id;
}

export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
```

---

## Детальні User Flows

### Flow 1: Швидке нагадування (без тексту)

```
┌─────────────────────────────────────────────────────────────┐
│ КРОК 1: Відкриття застосунку                                │
├─────────────────────────────────────────────────────────────┤
│ Тривалість: 0.3s                                            │
│ Дія: Користувач тапає на іконку застосунку                  │
│ Результат: Застосунок відкривається на головному екрані     │
│ Анімація: Fade in (200ms)                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ КРОК 2: Вибір часу                                          │
├─────────────────────────────────────────────────────────────┤
│ Тривалість: 0.5s                                            │
│ Дія: Тап на кнопку "30 хв"                                  │
│ Feedback:                                                   │
│   - Haptic: Light impact                                    │
│   - Visual: Кнопка scale(0.97) → scale(1)                   │
│   - Audio: Немає                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ КРОК 3: Підтвердження                                       │
├─────────────────────────────────────────────────────────────┤
│ Тривалість: 0.3s                                            │
│ Автоматично:                                                │
│   - Нагадування створено                                    │
│   - Toast: "Нагадування через 30 хв" (зникає через 2s)      │
│   - Картка з'являється в списку (slide in from bottom)      │
│ Користувач може закрити застосунок                          │
└─────────────────────────────────────────────────────────────┘

Загальний час: ~1.5 секунди
Кількість тапів: 1 (якщо застосунок вже на екрані) або 2 (відкриття + вибір)
```

### Flow 2: Нагадування з текстом

```
КРОК 1: Відкриття → 0.3s
КРОК 2: Тап на текстове поле → Клавіатура відкривається
КРОК 3: Введення "Перевір пральку" → ~3s
КРОК 4: Тап "Done" на клавіатурі → Клавіатура закривається
КРОК 5: Тап "1 год" → Нагадування створено
КРОК 6: Toast + картка в списку

Загальний час: ~5 секунд
Кількість тапів: 3 + typing
```

### Flow 3: Свій час

```
КРОК 1: Відкриття → 0.3s
КРОК 2: Тап "Свій час" → Bottom sheet відкривається (slide up, 300ms)
КРОК 3: Вибір години (scroll picker) → ~1s
КРОК 4: Вибір хвилин (scroll picker) → ~1s  
КРОК 5: Тап "Встановити" → Bottom sheet закривається
КРОК 6: Toast + картка в списку

Загальний час: ~4-5 секунд
Кількість тапів: 3 + scrolling
```

### Flow 4: Видалення нагадування

```
КРОК 1: Swipe left на картці → Кнопка "Видалити" з'являється
КРОК 2: Тап "Видалити" → 
   - Haptic: Medium impact
   - Картка slide out вправо (200ms)
   - Нотифікація скасована

АБО

КРОК 1: Continue swipe left до кінця → Автоматичне видалення
```

---

## Компоненти UI

### Component Tree

```
App
├── SafeAreaProvider
│   └── MainScreen
│       ├── InputZone
│       │   └── TextInput
│       ├── QuickButtonsZone
│       │   ├── TimeButton (×5)
│       │   └── CustomTimeButton
│       ├── RemindersZone
│       │   ├── SectionHeader
│       │   ├── ReminderCard (×N)
│       │   └── EmptyState
│       ├── CustomTimePicker (Bottom Sheet)
│       │   ├── Handle
│       │   ├── HourPicker
│       │   ├── MinutePicker
│       │   └── ConfirmButton
│       └── Toast
```

### TimeButton Component

```typescript
// components/TimeButton.tsx

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

interface TimeButtonProps {
  minutes: number;
  label: string;
  sublabel: string;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TimeButton: React.FC<TimeButtonProps> = ({
  minutes,
  label,
  sublabel,
  onPress,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };
  
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  return (
    <AnimatedTouchable
      style={[styles.button, animatedStyle, disabled && styles.disabled]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sublabel}>{sublabel}</Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
  },
});
```

### ReminderCard Component

```typescript
// components/ReminderCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: () => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onDelete,
}) => {
  const timeLeft = getTimeLeft(reminder.targetTime);
  const targetTimeStr = formatTime(reminder.targetTime);
  
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
  
  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutRight.duration(200)}
    >
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={20} color="#3B82F6" />
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {reminder.text || 'Нагадування'}
            </Text>
            <Text style={styles.countdown}>
              залишилось {timeLeft}
            </Text>
          </View>
          
          <Text style={styles.time}>{targetTimeStr}</Text>
        </View>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  countdown: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  time: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginLeft: 8,
    marginBottom: 8,
  },
});
```

### Custom Time Picker (Bottom Sheet)

```typescript
// components/CustomTimePicker.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';

interface CustomTimePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  
  const handleConfirm = () => {
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes > 0) {
      onConfirm(totalMinutes);
      onClose();
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <BottomSheet
      snapPoints={['40%']}
      onClose={onClose}
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Оберіть час</Text>
        
        <View style={styles.pickerRow}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={hours}
              onValueChange={setHours}
              style={styles.picker}
            >
              {[...Array(24)].map((_, i) => (
                <Picker.Item 
                  key={i} 
                  label={`${i} год`} 
                  value={i} 
                />
              ))}
            </Picker>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={minutes}
              onValueChange={setMinutes}
              style={styles.picker}
            >
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <Picker.Item 
                  key={m} 
                  label={`${m} хв`} 
                  value={m} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmText}>Встановити</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    backgroundColor: '#E5E7EB',
    width: 40,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 150,
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

---

## Анімації та мікро-взаємодії

### Принципи анімацій

```yaml
Duration:
  - Micro (press feedback): 100-150ms
  - Small (buttons, cards): 200ms
  - Medium (sheets, modals): 300ms
  - Large (screen transitions): 400ms

Easing:
  - Default: ease-out (decelerate)
  - Enter: ease-out
  - Exit: ease-in
  - Spring: damping 15, stiffness 150
```

### Каталог анімацій

| Елемент | Trigger | Анімація | Тривалість |
|---------|---------|----------|------------|
| TimeButton | Press | Scale 1 → 0.97 → 1 | 150ms |
| TimeButton | Release | Spring back | 200ms |
| ReminderCard | Create | FadeInDown + SlideIn | 200ms |
| ReminderCard | Delete | SlideOutRight + FadeOut | 200ms |
| Toast | Show | FadeIn + SlideUp | 200ms |
| Toast | Hide | FadeOut | 200ms |
| BottomSheet | Open | SlideUp | 300ms |
| BottomSheet | Close | SlideDown | 250ms |
| Input Focus | Focus | Border color change | 150ms |

### Haptic Feedback

```typescript
// Коли використовувати haptic feedback

// Light impact
- Натискання кнопки часу
- Вибір значення в picker

// Medium impact  
- Видалення нагадування
- Swipe to delete

// Success
- Нагадування успішно створено

// Warning
- Досягнуто ліміт нагадувань
- Спроба створити з 0 хвилинами

// НЕ використовувати
- Скролінг
- Звичайний тап на текстове поле
- Закриття bottom sheet
```

---

## Обробка станів

### App States

```typescript
type AppState = 
  | 'loading'      // Завантаження даних з AsyncStorage
  | 'ready'        // Готовий до використання
  | 'creating'     // Створення нагадування (короткий момент)
  | 'error';       // Помилка (рідко)
```

### UI States for Components

```typescript
// TimeButton states
type ButtonState = 'default' | 'pressed' | 'disabled';

// ReminderCard states  
type CardState = 'default' | 'swiping' | 'deleting';

// TextInput states
type InputState = 'empty' | 'focused' | 'filled' | 'maxLength';
```

### Empty States

**No reminders:**
```
┌─────────────────────────────────────┐
│                                     │
│              🔔                     │
│                                     │
│   Немає активних нагадувань         │
│                                     │
│   Оберіть час вище, щоб створити    │
│                                     │
└─────────────────────────────────────┘
```

**Max reminders reached:**
```
Кнопки стають disabled (opacity 0.5)
Toast: "Максимум 5 нагадувань. Видаліть одне, щоб додати нове."
```

### Error States

```typescript
// Notification permission denied
{
  title: "Потрібен дозвіл",
  message: "Дозвольте нотифікації, щоб отримувати нагадування",
  action: "Відкрити налаштування"
}

// Storage error (rare)
{
  title: "Помилка збереження", 
  message: "Не вдалося зберегти нагадування. Спробуйте ще раз.",
  action: "OK"
}
```

---

## Структура файлів проекту

```
quickremind/
├── app/
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Main screen
│
├── components/
│   ├── ui/
│   │   ├── TimeButton.tsx
│   │   ├── ReminderCard.tsx
│   │   ├── TextInput.tsx
│   │   ├── Toast.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── CustomTimePicker.tsx
│   └── index.ts                 # Barrel exports
│
├── store/
│   └── reminderStore.ts         # Zustand store
│
├── services/
│   ├── notifications.ts         # Expo notifications
│   └── storage.ts               # AsyncStorage helpers
│
├── utils/
│   ├── time.ts                  # Time formatting helpers
│   ├── uuid.ts                  # UUID generation
│   └── haptics.ts               # Haptic feedback helpers
│
├── constants/
│   ├── colors.ts                # Color palette
│   ├── typography.ts            # Font sizes, weights
│   ├── spacing.ts               # Spacing scale
│   └── quickTimes.ts            # Quick time button configs
│
├── types/
│   └── reminder.ts              # TypeScript interfaces
│
├── hooks/
│   ├── useReminders.ts          # Custom hook for store
│   └── useCountdown.ts          # Countdown timer hook
│
├── app.json                     # Expo config
├── package.json
├── tsconfig.json
└── README.md
```

### Конфігурація Quick Times

```typescript
// constants/quickTimes.ts

export interface QuickTime {
  id: string;
  minutes: number;
  label: string;
  sublabel: string;
}

export const QUICK_TIMES: QuickTime[] = [
  { id: '5min',  minutes: 5,   label: '5 хв',   sublabel: 'через 5 хвилин' },
  { id: '15min', minutes: 15,  label: '15 хв',  sublabel: 'через 15 хвилин' },
  { id: '30min', minutes: 30,  label: '30 хв',  sublabel: 'через 30 хвилин' },
  { id: '1hr',   minutes: 60,  label: '1 год',  sublabel: 'через 1 годину' },
  { id: '2hr',   minutes: 120, label: '2 год',  sublabel: 'через 2 години' },
];

export const CUSTOM_TIME_BUTTON = {
  id: 'custom',
  label: 'Свій час',
  sublabel: 'обрати вручну',
  icon: 'time-outline',
};
```

---

## Додаткові інструкції для AI

### Code Style

```yaml
Formatting:
  - Use Prettier defaults
  - 2 spaces indentation
  - Single quotes for strings
  - No semicolons (optional)
  - Trailing commas

Naming:
  - Components: PascalCase (TimeButton.tsx)
  - Hooks: camelCase with 'use' prefix (useReminders.ts)
  - Utils: camelCase (formatTime.ts)
  - Constants: UPPER_SNAKE_CASE (QUICK_TIMES)
  - Types/Interfaces: PascalCase (Reminder)

Comments:
  - JSDoc for exported functions
  - Inline comments only for complex logic
  - TODO comments for future improvements
```

### Performance Guidelines

```yaml
Optimization priorities:
  1. Fast app launch (< 1s)
  2. Instant button response (< 100ms)
  3. Smooth animations (60 fps)
  4. Minimal re-renders

Techniques:
  - React.memo for pure components
  - useCallback for event handlers
  - Reanimated for animations (native thread)
  - Lazy loading not needed (single screen)
```

### Testing Requirements

```yaml
Unit tests:
  - Time formatting utilities
  - UUID generation
  - Store actions

Integration tests:
  - Create reminder flow
  - Delete reminder flow
  - Notification scheduling

E2E tests (optional):
  - Full user flow from open to notification
```

---

## Чеклист для розробки

### Phase 1: Setup
- [ ] Initialize Expo project
- [ ] Configure TypeScript
- [ ] Set up project structure
- [ ] Install dependencies
- [ ] Configure ESLint/Prettier

### Phase 2: Core UI
- [ ] Create color/typography constants
- [ ] Build TimeButton component
- [ ] Build TextInput component  
- [ ] Build ReminderCard component
- [ ] Compose main screen layout
- [ ] Add empty state

### Phase 3: Functionality
- [ ] Set up Zustand store
- [ ] Implement add reminder
- [ ] Implement delete reminder
- [ ] Add countdown display
- [ ] Build CustomTimePicker

### Phase 4: Notifications
- [ ] Request permissions
- [ ] Schedule notifications
- [ ] Cancel notifications
- [ ] Handle notification tap

### Phase 5: Polish
- [ ] Add haptic feedback
- [ ] Implement animations
- [ ] Add Toast component
- [ ] Test on devices
- [ ] Performance optimization

### Phase 6: Release
- [ ] App icon and splash screen
- [ ] App Store screenshots
- [ ] Privacy policy
- [ ] Build for production
- [ ] Submit to stores

---

## Оновлення реалізації (v2 web)

Нижче перелік допрацювань, які вже реалізовані у поточній веб-версії та мають бути враховані в ТЗ.

### UI/UX
- Редизайн у стилі "notion-like soft minimal": нейтральна палітра, чорний акцент, м'які тіні, великі радіуси.
- Нижня навігація з індикатором активної вкладки; вкладки: Швидко, Активні, Створити, Статистика, Профіль.
- Екран "Спіймати думку" компактніший для iPhone: менші відступи, нижче поле вводу, менші кнопки швидкого часу.
- Time picker: 3 видимі значення, drag працює по всій ширині колонок, коректне прилипання до центру.
- Перемикач кроку хвилин: 5 хв (округлено) / 1 хв (точно).
- Єдина велика кнопка вибору дати з календарем (bottom sheet), дефолт — сьогодні.
- Активні нагадування: якщо дата не сьогодні — показ "дата · час"; залишок часу показує дні + години (24h логіка).
- Банер дозволу сповіщень завжди поверх інтерфейсу (fixed overlay).

### Поведінка
- Після створення нагадування (ручного або через швидку команду) автоматичний перехід на вкладку "Активні".
- Модалка створення/редагування швидкої команди: без autoFocus, фон не скролиться.

### Локалізація
- i18n: RU/UK, дефолтна мова — RU, перемикач мови у налаштуваннях.

### Технічні нотатки
- PWA build стабілізовано: workbox `mode: 'development'` для уникнення падіння terser під час генерації service worker.

---

## Контакти та зворотній зв'язок

Цей документ створено як повне технічне завдання для AI-агента. Якщо виникають питання або неоднозначності — завжди обирайте простіше рішення, яке відповідає принципу "нагадування за один тап".

**Головна метрика успіху:** Час від відкриття застосунку до створення нагадування **< 3 секунди**.

---

*Документ версії 1.0 | Січень 2026*
