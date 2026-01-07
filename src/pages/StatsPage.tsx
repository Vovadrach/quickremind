import { useMemo } from 'react';
import { useAppStore } from '@/store';
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts';
import { ACHIEVEMENTS } from '@/constants';
import { useI18n } from '@/hooks/useI18n';

export function StatsPage() {
  const { userStats, dailyStats } = useAppStore();
  const { copy, formatCount, getAchievementCopy, getWeekdaysShort, language } = useI18n();
  const weekdays = getWeekdaysShort();

  // Get last 7 days stats
  const weeklyData = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayStats = dailyStats[dateStr];
      result.push({
        name: weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1],
        val: dayStats?.captured || 0,
      });
    }
    return result;
  }, [dailyStats, weekdays, language]);

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
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-8">{copy.stats.title}</h1>

      <div className="space-y-6">
        {/* Streak Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 notion-shadow flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">🔥</span>
          </div>
          <h3 className="text-2xl font-black text-neutral-900 uppercase italic">
            🔥 {formatCount(userStats.currentStreak, 'day')}
          </h3>
          <p className="text-sm font-medium text-neutral-400 mt-1">{copy.stats.streakTitle}</p>

          <div className="flex justify-between w-full mt-6 px-2">
            {weekdays.map((d, i) => {
              const dayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
              const isCompleted = i <= dayIndex && userStats.currentStreak > dayIndex - i;
              return (
                <div key={d} className="flex flex-col items-center gap-2">
                  <span className={`text-[10px] font-bold ${i < 4 ? 'text-neutral-900' : 'text-neutral-300'}`}>
                    {d}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-50 text-neutral-200'
                    }`}
                  >
                    {isCompleted ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatBox label={copy.stats.dailyThoughts} value={(todayStats?.captured || 0).toString()} icon="💭" />
          <StatBox
            label={copy.stats.dailyCompleted}
            value={
              todayStats?.captured
                ? `${Math.round((todayStats.completed / todayStats.captured) * 100)}%`
                : '0%'
            }
            icon="✅"
          />
          <div className="col-span-2">
            <StatBox label={copy.stats.dailyCp} value={`+${todayStats?.cpEarned || 0}`} icon="✨" />
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 notion-shadow">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">{copy.stats.weeklyActivity}</h4>
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
                    <Cell key={index} fill={entry.val > 0 ? '#111827' : '#F3F4F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 notion-shadow">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{copy.stats.achievementsTitle}</h4>
            <button className="text-neutral-900 text-xs font-bold">{copy.stats.achievementsAll}</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {allAchievementsToShow.map((a) => {
              const isUnlocked = userStats.achievements.includes(a.id);
              const achievementCopy = getAchievementCopy(a.id);
              return (
                <div key={a.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border transition-all ${
                      isUnlocked
                        ? 'bg-white border-neutral-200 notion-shadow'
                        : 'bg-neutral-50 border-transparent opacity-20'
                    }`}
                  >
                    {isUnlocked ? a.icon : '🔒'}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center ${
                      isUnlocked ? 'text-neutral-800' : 'text-neutral-400'
                    }`}
                  >
                    {achievementCopy.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Time Stats */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 notion-shadow">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">{copy.stats.allTimeTitle}</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-500">{copy.stats.totalCaptured}</span>
              <span className="font-bold">{userStats.totalCaptured}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{copy.stats.totalCompleted}</span>
              <span className="font-bold">
                {userStats.totalCompleted} (
                {userStats.totalCaptured > 0
                  ? Math.round((userStats.totalCompleted / userStats.totalCaptured) * 100)
                  : 0}
                %)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{copy.stats.longestStreak}</span>
              <span className="font-bold">{formatCount(userStats.longestStreak, 'day')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">{copy.stats.totalCp}</span>
              <span className="font-bold text-neutral-900">{userStats.totalCP}</span>
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

function StatBox({ label, value, icon, color = 'text-neutral-900' }: StatBoxProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 notion-shadow">
      <span className="text-lg mb-1">{icon}</span>
      <span className={`text-2xl font-bold block ${color}`}>{value}</span>
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-tight">{label}</span>
    </div>
  );
}
