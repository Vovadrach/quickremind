import { useMemo } from 'react';
import { useAppStore } from '@/store';
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts';
import { ACHIEVEMENTS } from '@/constants';

export function StatsPage() {
  const { userStats, dailyStats } = useAppStore();

  // Get last 7 days stats
  const weeklyData = useMemo(() => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayStats = dailyStats[dateStr];
      result.push({
        name: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        val: dayStats?.captured || 0,
      });
    }
    return result;
  }, [dailyStats]);

  const today = new Date().toISOString().split('T')[0];
  const todayStats = dailyStats[today];

  // Check which achievements are unlocked
  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    userStats.achievements.includes(a.id)
  );

  const lockedAchievements = ACHIEVEMENTS.filter(
    (a) => !userStats.achievements.includes(a.id)
  ).slice(0, 4);

  const allAchievementsToShow = [...unlockedAchievements, ...lockedAchievements].slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Статистика</h1>

      <div className="space-y-6">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-[32px] p-6 text-white shadow-xl shadow-orange-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold opacity-80 uppercase tracking-widest mb-1">STREAK</h3>
              <p className="text-6xl font-black">{userStats.currentStreak} днів</p>
            </div>
            <span className="text-5xl">🔥</span>
          </div>

          <div className="flex justify-between mb-4">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d, i) => {
              const dayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
              const isCompleted = i <= dayIndex && userStats.currentStreak > dayIndex - i;
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold opacity-60">{d}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCompleted ? 'bg-white/30 text-white' : 'border border-white/30 opacity-40'
                    }`}
                  >
                    {isCompleted ? '✅' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-black/10 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${((userStats.currentStreak % 7) / 7) * 100}%` }}
            />
          </div>
          <p className="text-xs font-bold opacity-80">
            До 7-денного badge: {7 - (userStats.currentStreak % 7)} днів
          </p>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Думок" value={(todayStats?.captured || 0).toString()} icon="💭" />
          <StatBox
            label="Виконано"
            value={
              todayStats?.captured
                ? `${Math.round((todayStats.completed / todayStats.captured) * 100)}%`
                : '0%'
            }
            icon="✅"
          />
          <StatBox label="CP" value={`+${todayStats?.cpEarned || 0}`} icon="✨" color="text-purple-600" />
        </div>

        {/* Activity Chart */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-gray-400 tracking-widest mb-6">АКТИВНІСТЬ ТИЖНЯ</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }}
                />
                <Bar dataKey="val" radius={[8, 8, 8, 8]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={index} fill={entry.val > 0 ? '#3B82F6' : '#F3F4F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-bold text-gray-400 tracking-widest">ДОСЯГНЕННЯ</h4>
            <button className="text-blue-600 text-xs font-bold">Дивитись всі →</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {allAchievementsToShow.map((a) => {
              const isUnlocked = userStats.achievements.includes(a.id);
              return (
                <div key={a.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                      isUnlocked
                        ? 'bg-yellow-50 border-yellow-100'
                        : 'bg-gray-50 border-gray-100 grayscale opacity-40'
                    }`}
                  >
                    {isUnlocked ? a.icon : '🔒'}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center ${
                      isUnlocked ? 'text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    {a.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Time Stats */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-gray-400 tracking-widest mb-4">ЗА ВЕСЬ ЧАС</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Думок зловлено</span>
              <span className="font-bold">{userStats.totalCaptured}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Виконано</span>
              <span className="font-bold">
                {userStats.totalCompleted} (
                {userStats.totalCaptured > 0
                  ? Math.round((userStats.totalCompleted / userStats.totalCaptured) * 100)
                  : 0}
                %)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Найдовший streak</span>
              <span className="font-bold">{userStats.longestStreak} днів</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Всього CP</span>
              <span className="font-bold text-purple-600">{userStats.totalCP}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

function StatBox({ label, value, icon, color = 'text-gray-800' }: StatBoxProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center">
      <span className="text-lg mb-1">{icon}</span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
    </div>
  );
}
