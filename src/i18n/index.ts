import type { Language } from '@/types';

type PluralForms = {
  one: string;
  few: string;
  many: string;
  other: string;
};

type NounKey = 'day' | 'thought' | 'reminder' | 'command';

type Translation = {
  tabs: {
    commands: string;
    active: string;
    capture: string;
    stats: string;
    profile: string;
  };
  capture: {
    todayCp: string;
    placeholder: string;
    quickHeader: string;
    customHeader: string;
    dateButtonLabel: string;
    dateButtonToday: string;
    dateSheetTitle: string;
    dateConfirm: string;
    minuteStepRounded: string;
    minuteStepExact: string;
    hoursLabel: string;
    minutesLabel: string;
    notePlaceholder: string;
    emojiAddLabel: string;
    emojiClearLabel: string;
    todayButton: string;
    otherDateButton: string;
    todayAlert: string;
    otherDateAlert: string;
    action: string;
    successAction: string;
    cpToast: string;
  };
  active: {
    title: string;
    emptyTitle: string;
    sections: {
      nearest: string;
      today: string;
      later: string;
    };
    completedTitle: string;
    reminderFallback: string;
    missed: string;
    inPrefix: string;
    timeLeftPrefix: string;
    timeExpired: string;
  };
  commands: {
    title: string;
    searchPlaceholder: string;
    emptySearch: string;
    emptyTitle: string;
    emptySubtitle: string;
    newCommand: string;
    successOverlay: string;
    modalTitleCreate: string;
    modalTitleEdit: string;
    labelName: string;
    placeholderName: string;
    noteLabel: string;
    notePlaceholder: string;
    labelCategory: string;
    labelTimeOptions: string;
    addTime: string;
    timeTypeRelative: string;
    timeTypeAbsolute: string;
    cancel: string;
    add: string;
    create: string;
    save: string;
  };
  beeMode: {
    title: string;
    description: string;
    infoTitle: string;
    infoBody: string;
    intervalsLabel: string;
    repeatEvery: string;
    repeatOff: string;
    quietHoursLabel: string;
    quietHoursUntil: string;
    configure: string;
    modalTitle: string;
    modalDescription: string;
    intervalFirst: string;
    intervalSecond: string;
    intervalThird: string;
    intervalFourth: string;
    intervalRepeat: string;
    save: string;
    nextLabel: string;
    notificationReminderTitle: string;
    notificationReminderBody: string;
    notificationStillTitle: string;
    notificationStillBody: string;
    notificationHourTitle: string;
    notificationHourBody: string;
    notificationTwoHoursTitle: string;
    notificationTwoHoursBody: string;
    notificationLastTitle: string;
    notificationLastBody: string;
  };
  recurring: {
    title: string;
    tabQuick: string;
    tabRecurring: string;
    emptyTitle: string;
    emptySubtitle: string;
    newTask: string;
    modalTitleCreate: string;
    modalTitleEdit: string;
    labelName: string;
    placeholderName: string;
    labelRepeat: string;
    repeatDaily: string;
    repeatWeekly: string;
    repeatMonthly: string;
    repeatCustom: string;
    labelTime: string;
    noteLabel: string;
    notePlaceholder: string;
    labelWeekdays: string;
    labelMonthDay: string;
    labelLastDay: string;
    labelCustomEvery: string;
    labelStartDate: string;
    labelBeeMode: string;
    create: string;
    save: string;
    pause: string;
    resume: string;
    summaryDaily: string;
    summaryWeekly: string;
    summaryMonthly: string;
    summaryMonthlyLast: string;
    summaryCustom: string;
    unitDays: string;
    unitWeeks: string;
    unitMonths: string;
    nextLabel: string;
    toastCreated: string;
    toastUpdated: string;
    toastDeleted: string;
  };
  stats: {
    title: string;
    streakTitle: string;
    badgeRemaining: string;
    dailyThoughts: string;
    dailyCompleted: string;
    dailyCp: string;
    weeklyActivity: string;
    achievementsTitle: string;
    achievementsAll: string;
    allTimeTitle: string;
    totalCaptured: string;
    totalCompleted: string;
    longestStreak: string;
    totalCp: string;
  };
  profile: {
    title: string;
    levelLabel: string;
    levelProgress: string;
    levelProgressLabel: string;
    premiumTitle: string;
    premiumDescription: string;
    premiumPrice: string;
    settingsHeader: string;
    otherHeader: string;
    versionLabel: string;
  };
  settings: {
    notificationSound: string;
    vibration: string;
    darkMode: string;
    shareApp: string;
    rateApp: string;
    feedback: string;
    language: string;
  };
  alerts: {
    premium: string;
    darkModePro: string;
    shareCopied: string;
    openSection: string;
  };
  share: {
    title: string;
    text: string;
  };
  notifications: {
    title: string;
    body: string;
  };
  toasts: {
    maxReminders: string;
    minMinutes: string;
    captureSuccess: string;
    completedOnTime: string;
    completed: string;
    postponed: string;
    maxCommands: string;
    commandCreated: string;
    commandUpdated: string;
    commandDeleted: string;
    achievementUnlocked: string;
  };
  permissions: {
    notificationsTitle: string;
    notificationsDescription: string;
    notificationsAction: string;
  };
  time: {
    now: string;
    inPrefix: string;
    ago: string;
    tomorrow: string;
    hourShort: string;
    minuteShort: string;
    secondShort: string;
  };
  language: {
    sheetTitle: string;
  };
  levels: string[];
  weekdaysShort: string[];
  achievements: Record<string, { name: string; description: string }>;
};

const ru: Translation = {
  tabs: {
    commands: 'Команды',
    active: 'Активные',
    capture: 'Создать',
    stats: 'Стат.',
    profile: 'Профиль',
  },
  capture: {
    todayCp: '+{count} CP сегодня',
    placeholder: 'О чем не забыть?',
    notePlaceholder: 'Добавить заметку',
    quickHeader: 'Быстро',
    customHeader: 'Или выбери время',
    dateButtonLabel: 'Дата',
    dateButtonToday: 'Сегодня',
    dateSheetTitle: 'Выбрать дату',
    dateConfirm: 'Подтвердить',
    minuteStepRounded: '5 мин',
    minuteStepExact: '1 мин',
    hoursLabel: 'Часы',
    minutesLabel: 'Минуты',
    emojiAddLabel: 'Добавить эмодзи',
    emojiClearLabel: 'Убрать эмодзи',
    todayButton: 'Сегодня ▼',
    otherDateButton: 'Другая дата',
    todayAlert: 'Выбор дня скоро будет доступен!',
    otherDateAlert: 'Календарь уже разрабатывается!',
    action: 'ПОЙМАТЬ МЫСЛЬ',
    successAction: 'МЫСЛЬ ПОЙМАНА!',
    cpToast: '+1 CP 🎯',
  },
  active: {
    title: 'Активные напоминания',
    emptyTitle: 'Пока планов нет',
    sections: {
      nearest: 'БЛИЖАЙШИЕ',
      today: 'СЕГОДНЯ',
      later: 'ПОЗЖЕ',
    },
    completedTitle: 'Выполнено недавно',
    reminderFallback: 'Напоминание',
    missed: 'Пропущено',
    inPrefix: 'через',
    timeLeftPrefix: 'осталось',
    timeExpired: 'Время пришло!',
  },
  commands: {
    title: 'Быстрые команды',
    searchPlaceholder: '🔍 Поиск команды...',
    emptySearch: 'Команд не найдено 😕',
    emptyTitle: 'Пока нет команд',
    emptySubtitle: 'Создайте первую команду!',
    newCommand: 'Новая команда',
    successOverlay: 'ПОЙМАНО! ✨',
    modalTitleCreate: 'Новая команда',
    modalTitleEdit: 'Редактировать команду',
    labelName: 'НАЗВАНИЕ',
    placeholderName: 'Например: Читать книгу',
    noteLabel: 'ЗАМЕТКА',
    notePlaceholder: 'Добавить заметку',
    labelCategory: 'КАТЕГОРИЯ',
    labelTimeOptions: 'ВАРИАНТЫ ВРЕМЕНИ',
    addTime: 'Добавить',
    timeTypeRelative: 'Через время',
    timeTypeAbsolute: 'Точное время',
    cancel: 'Отмена',
    add: 'Добавить',
    create: 'СОЗДАТЬ',
    save: 'СОХРАНИТЬ',
  },
  beeMode: {
    title: 'Bee Mode',
    description: 'Повторные уведомления пока не выполните',
    infoTitle: 'Что такое Bee Mode',
    infoBody: 'Bee Mode отправляет повторные напоминания, пока задача не выполнена.\nВыберите интервалы и повтор, а в «Не беспокоить» уведомления не приходят.',
    intervalsLabel: 'Интервалы',
    repeatEvery: 'каждые {interval}',
    repeatOff: 'без повтора',
    quietHoursLabel: 'Не беспокоить после',
    quietHoursUntil: 'до',
    configure: 'Настроить',
    modalTitle: 'Bee Mode',
    modalDescription: 'Этот режим будет напоминать о невыполненных задачах через заданные интервалы.',
    intervalFirst: 'Первое напоминание',
    intervalSecond: 'Второе напоминание',
    intervalThird: 'Третье напоминание',
    intervalFourth: 'Четвертое напоминание',
    intervalRepeat: 'Дальше каждые',
    save: 'Сохранить',
    nextLabel: 'Следующее напоминание: {time}',
    notificationReminderTitle: '🐝 Напоминание: {text}',
    notificationReminderBody: 'Прошло {minutes} мин',
    notificationStillTitle: '🐝 Вы все еще не выполнили: {text}',
    notificationStillBody: 'Прошло уже {minutes} мин',
    notificationHourTitle: '🐝 Час прошел! {text}',
    notificationHourBody: 'Выполните, чтобы сохранить streak 🔥',
    notificationTwoHoursTitle: '🐝🐝 Серьезно? {text}',
    notificationTwoHoursBody: '2 часа ожидания!',
    notificationLastTitle: '🐝 🌙 Последний шанс сегодня',
    notificationLastBody: '{text}',
  },
  recurring: {
    title: 'Повторяющиеся задачи',
    tabQuick: 'Быстрые',
    tabRecurring: 'Повтор.',
    emptyTitle: 'Пока нет повторяющихся задач',
    emptySubtitle: 'Создайте первую задачу',
    newTask: 'Новая повторяющаяся задача',
    modalTitleCreate: 'Новая повторяющаяся задача',
    modalTitleEdit: 'Редактировать задачу',
    labelName: 'НАЗВАНИЕ',
    placeholderName: 'Например: Выпить витамины',
    labelRepeat: 'ПОВТОРЕНИЕ',
    repeatDaily: 'Ежедневно',
    repeatWeekly: 'Еженедельно',
    repeatMonthly: 'Ежемесячно',
    repeatCustom: 'Другое',
    labelTime: 'ВРЕМЯ',
    noteLabel: 'ЗАМЕТКА',
    notePlaceholder: 'Добавить заметку',
    labelWeekdays: 'Выберите дни',
    labelMonthDay: 'Каждого',
    labelLastDay: 'Последний день месяца',
    labelCustomEvery: 'Каждые',
    labelStartDate: 'Начать с',
    labelBeeMode: 'Bee Mode',
    create: 'СОЗДАТЬ',
    save: 'СОХРАНИТЬ',
    pause: 'Пауза',
    resume: 'Продолжить',
    summaryDaily: 'Каждый день в {time}',
    summaryWeekly: '{days} в {time}',
    summaryMonthly: 'Каждого {day}-го в {time}',
    summaryMonthlyLast: 'В последний день месяца в {time}',
    summaryCustom: 'Каждые {count} {unit} в {time}',
    unitDays: 'дн.',
    unitWeeks: 'нед.',
    unitMonths: 'мес.',
    nextLabel: 'Следующее: {date} · {time}',
    toastCreated: 'Повторяющаяся задача создана',
    toastUpdated: 'Повторяющаяся задача обновлена',
    toastDeleted: 'Повторяющаяся задача удалена',
  },
  stats: {
    title: 'Статистика',
    streakTitle: 'СЕРИЯ',
    badgeRemaining: 'До значка 7 дней: {count}',
    dailyThoughts: 'Мыслей',
    dailyCompleted: 'Выполнено',
    dailyCp: 'CP',
    weeklyActivity: 'АКТИВНОСТЬ НЕДЕЛИ',
    achievementsTitle: 'ДОСТИЖЕНИЯ',
    achievementsAll: 'Смотреть все →',
    allTimeTitle: 'ЗА ВСЕ ВРЕМЯ',
    totalCaptured: 'Мыслей поймано',
    totalCompleted: 'Выполнено',
    longestStreak: 'Самая длинная серия',
    totalCp: 'Всего CP',
  },
  profile: {
    title: 'Профиль',
    levelLabel: 'Уровень {level}',
    levelProgress: '{current} / {next} CP до уровня {level}',
    levelProgressLabel: 'Прогресс уровня',
    premiumTitle: 'QuickRemind PRO',
    premiumDescription: 'Неограниченные команды, виджеты и темная тема',
    premiumPrice: '$2.99 один раз',
    settingsHeader: 'НАСТРОЙКИ',
    otherHeader: 'ДРУГОЕ',
    versionLabel: 'ВЕРСИЯ',
  },
  settings: {
    notificationSound: 'Звук уведомлений',
    vibration: 'Вибрация',
    darkMode: 'Темная тема',
    shareApp: 'Поделиться приложением',
    rateApp: 'Оценить в App Store',
    feedback: 'Отправить отзыв',
    language: 'Язык',
  },
  alerts: {
    premium: 'Спасибо за интерес! Оплата в тестовом режиме недоступна. Вы уже PRO в нашем сердце! ❤️',
    darkModePro: 'Функция темной темы доступна только в PRO версии.',
    shareCopied: 'Ссылка скопирована: {url}',
    openSection: 'Открываем: {label}',
  },
  share: {
    title: 'QuickRemind 2.0',
    text: 'Попробуй это крутое приложение для напоминаний!',
  },
  notifications: {
    title: 'Напоминание',
    body: 'Время пришло!',
  },
  toasts: {
    maxReminders: 'Максимум {count}',
    minMinutes: 'Минимум 1 минута',
    captureSuccess: 'Мысль поймана! Через {time}',
    completedOnTime: 'Выполнено вовремя!',
    completed: 'Выполнено!',
    postponed: 'Отложено на {time}',
    maxCommands: 'Максимум {count}',
    commandCreated: 'Команда создана!',
    commandUpdated: 'Команда обновлена!',
    commandDeleted: 'Команда удалена',
    achievementUnlocked: '{name} получено!',
  },
  permissions: {
    notificationsTitle: 'Включите уведомления',
    notificationsDescription: 'Чтобы получать напоминания вовремя',
    notificationsAction: 'Включить',
  },
  time: {
    now: 'сейчас',
    inPrefix: 'через',
    ago: 'назад',
    tomorrow: 'Завтра',
    hourShort: 'ч',
    minuteShort: 'мин',
    secondShort: 'сек',
  },
  language: {
    sheetTitle: 'Выберите язык',
  },
  levels: [
    'Новичок',
    'Ученик',
    'Организатор',
    'Фокусник',
    'Ловец мыслей',
    'Мастер мысли',
    'Фокус профи',
    'Гуру памяти',
    'Повелитель времени',
    'Мастер дзена',
  ],
  weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  achievements: {
    first_capture: { name: 'Первый захват', description: 'Поймали первую мысль' },
    speed_demon: { name: 'Демон скорости', description: 'Создали напоминание за 3 секунды' },
    week_warrior: { name: 'Воин недели', description: 'Серия 7 дней' },
    two_weeks: { name: 'Две недели подряд', description: 'Серия 14 дней' },
    month_master: { name: 'Мастер месяца', description: 'Серия 30 дней' },
    precision_10: { name: 'Точность', description: '10 напоминаний выполнено вовремя' },
    precision_50: { name: 'Меткий стрелок', description: '50 напоминаний выполнено вовремя' },
    precision_100: { name: 'Мастер точности', description: '100 напоминаний выполнено вовремя' },
    mind_organizer_50: { name: 'Организатор мыслей', description: '50 мыслей зафиксировано' },
    mind_organizer_100: { name: 'Коллекционер мыслей', description: '100 мыслей зафиксировано' },
    mind_organizer_500: { name: 'Мастер памяти', description: '500 мыслей зафиксировано' },
    command_creator_5: { name: 'Создатель команд', description: 'Создали 5 быстрых команд' },
    command_creator_10: { name: 'Профи автоматизации', description: 'Создали 10 быстрых команд' },
    superstar: { name: 'Суперзвезда', description: '100 CP за один день' },
    cp_500: { name: 'Восходящая звезда', description: 'Собрали 500 CP' },
    cp_1000: { name: 'Сияющий самоцвет', description: 'Собрали 1000 CP' },
    cp_5000: { name: 'Алмазный ум', description: 'Собрали 5000 CP' },
  },
};

const uk: Translation = {
  tabs: {
    commands: 'Команди',
    active: 'Активні',
    capture: 'Створити',
    stats: 'Стат.',
    profile: 'Профіль',
  },
  capture: {
    todayCp: '+{count} CP сьогодні',
    placeholder: 'Про що не забути?',
    notePlaceholder: 'Додати нотатку',
    quickHeader: 'Швидко',
    customHeader: 'Або обери час',
    dateButtonLabel: 'Дата',
    dateButtonToday: 'Сьогодні',
    dateSheetTitle: 'Обрати дату',
    dateConfirm: 'Підтвердити',
    minuteStepRounded: '5 хв',
    minuteStepExact: '1 хв',
    hoursLabel: 'Години',
    minutesLabel: 'Хвилини',
    emojiAddLabel: 'Додати емодзі',
    emojiClearLabel: 'Прибрати емодзі',
    todayButton: 'Сьогодні ▼',
    otherDateButton: 'Інша дата',
    todayAlert: 'Вибір дня скоро буде доступний!',
    otherDateAlert: 'Календар вже розробляється!',
    action: 'ЗЛОВИТИ ДУМКУ',
    successAction: 'ДУМКУ ЗЛОВЛЕНО!',
    cpToast: '+1 CP 🎯',
  },
  active: {
    title: 'Активні нагадування',
    emptyTitle: 'Поки що немає планів',
    sections: {
      nearest: 'НАЙБЛИЖЧІ',
      today: 'СЬОГОДНІ',
      later: 'ПІЗНІШЕ',
    },
    completedTitle: 'Виконано нещодавно',
    reminderFallback: 'Нагадування',
    missed: 'Пропущено',
    inPrefix: 'через',
    timeLeftPrefix: 'залишилось',
    timeExpired: 'Час настав!',
  },
  commands: {
    title: 'Швидкі команди',
    searchPlaceholder: '🔍 Пошук команди...',
    emptySearch: 'Команд не знайдено 😕',
    emptyTitle: 'Ще немає команд',
    emptySubtitle: 'Створіть першу команду!',
    newCommand: 'Нова команда',
    successOverlay: 'ЗЛОВЛЕНО! ✨',
    modalTitleCreate: 'Нова команда',
    modalTitleEdit: 'Редагувати команду',
    labelName: 'НАЗВА',
    placeholderName: 'Наприклад: Читати книгу',
    noteLabel: 'НОТАТКА',
    notePlaceholder: 'Додати нотатку',
    labelCategory: 'КАТЕГОРІЯ',
    labelTimeOptions: 'ВАРІАНТИ ЧАСУ',
    addTime: 'Додати',
    timeTypeRelative: 'Через час',
    timeTypeAbsolute: 'Точний час',
    cancel: 'Скасувати',
    add: 'Додати',
    create: 'СТВОРИТИ',
    save: 'ЗБЕРЕГТИ',
  },
  beeMode: {
    title: 'Bee Mode',
    description: 'Повторні сповіщення поки не виконаєте',
    infoTitle: 'Що таке Bee Mode',
    infoBody: 'Bee Mode надсилає повторні нагадування, доки задача не виконана.\nОберіть інтервали й повтор, а в режимі «Не турбувати» сповіщення не приходять.',
    intervalsLabel: 'Інтервали',
    repeatEvery: 'кожні {interval}',
    repeatOff: 'без повтору',
    quietHoursLabel: 'Не турбувати після',
    quietHoursUntil: 'до',
    configure: 'Налаштувати',
    modalTitle: 'Bee Mode',
    modalDescription: 'Цей режим буде нагадувати про невиконані задачі через задані інтервали.',
    intervalFirst: 'Перше нагадування',
    intervalSecond: 'Друге нагадування',
    intervalThird: 'Третє нагадування',
    intervalFourth: 'Четверте нагадування',
    intervalRepeat: 'Далі кожні',
    save: 'Зберегти',
    nextLabel: 'Наступне нагадування: {time}',
    notificationReminderTitle: '🐝 Нагадування: {text}',
    notificationReminderBody: 'Минуло {minutes} хв',
    notificationStillTitle: '🐝 Ви досі не виконали: {text}',
    notificationStillBody: 'Минуло вже {minutes} хв',
    notificationHourTitle: '🐝 Година минула! {text}',
    notificationHourBody: 'Виконайте, щоб зберегти streak 🔥',
    notificationTwoHoursTitle: '🐝🐝 Серйозно? {text}',
    notificationTwoHoursBody: '2 години очікування!',
    notificationLastTitle: '🐝 🌙 Останній шанс сьогодні',
    notificationLastBody: '{text}',
  },
  recurring: {
    title: 'Повторювані задачі',
    tabQuick: 'Швидкі',
    tabRecurring: 'Повтор.',
    emptyTitle: 'Поки немає повторюваних задач',
    emptySubtitle: 'Створіть першу задачу',
    newTask: 'Нова повторювана задача',
    modalTitleCreate: 'Нова повторювана задача',
    modalTitleEdit: 'Редагувати задачу',
    labelName: 'НАЗВА',
    placeholderName: 'Наприклад: Випити вітаміни',
    labelRepeat: 'ПОВТОРЕННЯ',
    repeatDaily: 'Щодня',
    repeatWeekly: 'Щотижня',
    repeatMonthly: 'Щомісяця',
    repeatCustom: 'Інше',
    labelTime: 'ЧАС',
    noteLabel: 'НОТАТКА',
    notePlaceholder: 'Додати нотатку',
    labelWeekdays: 'Оберіть дні',
    labelMonthDay: 'Кожного',
    labelLastDay: 'Останній день місяця',
    labelCustomEvery: 'Кожні',
    labelStartDate: 'Почати з',
    labelBeeMode: 'Bee Mode',
    create: 'СТВОРИТИ',
    save: 'ЗБЕРЕГТИ',
    pause: 'Пауза',
    resume: 'Продовжити',
    summaryDaily: 'Щодня о {time}',
    summaryWeekly: '{days} о {time}',
    summaryMonthly: 'Кожного {day}-го о {time}',
    summaryMonthlyLast: 'В останній день місяця о {time}',
    summaryCustom: 'Кожні {count} {unit} о {time}',
    unitDays: 'дн.',
    unitWeeks: 'тиж.',
    unitMonths: 'міс.',
    nextLabel: 'Наступне: {date} · {time}',
    toastCreated: 'Повторювана задача створена',
    toastUpdated: 'Повторювана задача оновлена',
    toastDeleted: 'Повторювана задача видалена',
  },
  stats: {
    title: 'Статистика',
    streakTitle: 'СЕРІЯ',
    badgeRemaining: 'До бейджа на 7 днів: {count}',
    dailyThoughts: 'Думок',
    dailyCompleted: 'Виконано',
    dailyCp: 'CP',
    weeklyActivity: 'АКТИВНІСТЬ ТИЖНЯ',
    achievementsTitle: 'ДОСЯГНЕННЯ',
    achievementsAll: 'Дивитись всі →',
    allTimeTitle: 'ЗА ВЕСЬ ЧАС',
    totalCaptured: 'Думок зловлено',
    totalCompleted: 'Виконано',
    longestStreak: 'Найдовша серія',
    totalCp: 'Всього CP',
  },
  profile: {
    title: 'Профіль',
    levelLabel: 'Рівень {level}',
    levelProgress: '{current} / {next} CP до рівня {level}',
    levelProgressLabel: 'Прогрес рівня',
    premiumTitle: 'QuickRemind PRO',
    premiumDescription: 'Необмежені команди, віджети та темна тема',
    premiumPrice: '$2.99 одноразово',
    settingsHeader: 'НАЛАШТУВАННЯ',
    otherHeader: 'ІНШЕ',
    versionLabel: 'ВЕРСІЯ',
  },
  settings: {
    notificationSound: 'Звук нотифікацій',
    vibration: 'Вібрація',
    darkMode: 'Темна тема',
    shareApp: 'Поділитися застосунком',
    rateApp: 'Оцінити в App Store',
    feedback: 'Надіслати відгук',
    language: 'Мова',
  },
  alerts: {
    premium: 'Дякуємо за інтерес! Оплата в тестовому режимі недоступна. Ви вже PRO в нашому серці! ❤️',
    darkModePro: 'Функція Dark Mode доступна лише в PRO версії.',
    shareCopied: 'Скопійовано посилання: {url}',
    openSection: 'Відкриваємо: {label}',
  },
  share: {
    title: 'QuickRemind 2.0',
    text: 'Спробуй цей крутий застосунок для нагадувань!',
  },
  notifications: {
    title: 'Нагадування',
    body: 'Час настав!',
  },
  toasts: {
    maxReminders: 'Максимум {count}',
    minMinutes: 'Мінімум 1 хвилина',
    captureSuccess: 'Думку зловлено! Через {time}',
    completedOnTime: 'Виконано вчасно!',
    completed: 'Виконано!',
    postponed: 'Відкладено на {time}',
    maxCommands: 'Максимум {count}',
    commandCreated: 'Команду створено!',
    commandUpdated: 'Команду оновлено!',
    commandDeleted: 'Команду видалено',
    achievementUnlocked: '{name} отримано!',
  },
  permissions: {
    notificationsTitle: 'Увімкніть сповіщення',
    notificationsDescription: 'Щоб отримувати нагадування вчасно',
    notificationsAction: 'Увімкнути',
  },
  time: {
    now: 'зараз',
    inPrefix: 'через',
    ago: 'тому',
    tomorrow: 'Завтра',
    hourShort: 'год',
    minuteShort: 'хв',
    secondShort: 'сек',
  },
  language: {
    sheetTitle: 'Оберіть мову',
  },
  levels: [
    'Новачок',
    'Учень',
    'Організатор',
    'Фокусник',
    'Ловець думок',
    'Майстер думок',
    'Фокус профі',
    "Гуру пам'яті",
    'Володар часу',
    'Майстер дзену',
  ],
  weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
  achievements: {
    first_capture: { name: 'Перший улов', description: 'Зловили першу думку' },
    speed_demon: { name: 'Демон швидкості', description: 'Створили нагадування за 3 секунди' },
    week_warrior: { name: 'Воїн тижня', description: '7-денний streak' },
    two_weeks: { name: 'Два тижні поспіль', description: '14-денний streak' },
    month_master: { name: 'Майстер місяця', description: '30-денний streak' },
    precision_10: { name: 'Точність', description: '10 нагадувань виконано вчасно' },
    precision_50: { name: 'Влучний стрілець', description: '50 нагадувань виконано вчасно' },
    precision_100: { name: 'Майстер влучності', description: '100 нагадувань виконано вчасно' },
    mind_organizer_50: { name: 'Організатор думок', description: '50 думок зафіксовано' },
    mind_organizer_100: { name: 'Збирач думок', description: '100 думок зафіксовано' },
    mind_organizer_500: { name: "Майстер пам'яті", description: '500 думок зафіксовано' },
    command_creator_5: { name: 'Творець команд', description: 'Створили 5 швидких команд' },
    command_creator_10: { name: 'Профі автоматизації', description: 'Створили 10 швидких команд' },
    superstar: { name: 'Суперзірка', description: '100 CP за один день' },
    cp_500: { name: 'Зірка, що сходить', description: 'Зібрали 500 CP' },
    cp_1000: { name: 'Сяючий самоцвіт', description: 'Зібрали 1000 CP' },
    cp_5000: { name: 'Діамантовий розум', description: 'Зібрали 5000 CP' },
  },
};

const en: Translation = ru;

const translations: Record<Language, Translation> = { ru, uk, en };

const LOCALES: Record<Language, string> = {
  ru: 'ru-RU',
  uk: 'uk-UA',
  en: 'en-US',
};

const TIME_UNITS: Record<Language, { hour: string; minute: string; second: string }> = {
  ru: { hour: 'ч', minute: 'мин', second: 'сек' },
  uk: { hour: 'год', minute: 'хв', second: 'сек' },
  en: { hour: 'h', minute: 'min', second: 's' },
};

const NOUN_FORMS: Record<Language, Record<NounKey, PluralForms>> = {
  ru: {
    day: { one: 'день', few: 'дня', many: 'дней', other: 'дней' },
    thought: { one: 'мысль', few: 'мысли', many: 'мыслей', other: 'мысли' },
    reminder: { one: 'напоминание', few: 'напоминания', many: 'напоминаний', other: 'напоминаний' },
    command: { one: 'команда', few: 'команды', many: 'команд', other: 'команд' },
  },
  uk: {
    day: { one: 'день', few: 'дні', many: 'днів', other: 'днів' },
    thought: { one: 'думка', few: 'думки', many: 'думок', other: 'думки' },
    reminder: { one: 'нагадування', few: 'нагадування', many: 'нагадувань', other: 'нагадування' },
    command: { one: 'команда', few: 'команди', many: 'команд', other: 'команди' },
  },
  en: {
    day: { one: 'day', few: 'days', many: 'days', other: 'days' },
    thought: { one: 'thought', few: 'thoughts', many: 'thoughts', other: 'thoughts' },
    reminder: { one: 'reminder', few: 'reminders', many: 'reminders', other: 'reminders' },
    command: { one: 'command', few: 'commands', many: 'commands', other: 'commands' },
  },
};

const PLURAL_RULES: Record<Language, Intl.PluralRules> = {
  ru: new Intl.PluralRules('ru-RU'),
  uk: new Intl.PluralRules('uk-UA'),
  en: new Intl.PluralRules('en-US'),
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  ru: 'Русский',
  uk: 'Українська',
  en: 'English',
};

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: 'ru', label: LANGUAGE_LABELS.ru },
  { value: 'uk', label: LANGUAGE_LABELS.uk },
];

export function getCopy(language: Language): Translation {
  return translations[language] ?? translations.ru;
}

export function getLocale(language: Language): string {
  return LOCALES[language] ?? LOCALES.ru;
}

export function getTimeUnitLabel(language: Language, unit: 'hour' | 'minute' | 'second'): string {
  return TIME_UNITS[language]?.[unit] ?? TIME_UNITS.ru[unit];
}

export function formatMessage(
  template: string,
  params: Record<string, string | number> = {}
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''));
}

export function formatCount(language: Language, count: number, noun: NounKey): string {
  const rule = (PLURAL_RULES[language] ?? PLURAL_RULES.ru).select(count) as keyof PluralForms;
  const forms = NOUN_FORMS[language]?.[noun] ?? NOUN_FORMS.ru[noun];
  return `${count} ${forms[rule] ?? forms.other}`;
}

export function getLanguageLabel(code: Language): string {
  return LANGUAGE_LABELS[code] ?? LANGUAGE_LABELS.ru;
}

export function getAchievementCopy(language: Language, id: string): { name: string; description: string } {
  const copy = getCopy(language);
  const fallback = getCopy('ru');
  return copy.achievements[id] ?? fallback.achievements[id] ?? { name: id, description: '' };
}

export function getLevelName(language: Language, level: number): string {
  const copy = getCopy(language);
  return copy.levels[level - 1] ?? copy.levels[copy.levels.length - 1];
}

export function getWeekdaysShort(language: Language): string[] {
  return getCopy(language).weekdaysShort;
}
