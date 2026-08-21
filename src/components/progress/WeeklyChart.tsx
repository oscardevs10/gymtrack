import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts';
import type { WeeklyProgressPoint } from '../../types';

export function WeeklyChart({ data }: { data: WeeklyProgressPoint[] }) {
  const maxIndex = data.reduce((best, d, i) => (d.volume > data[best].volume ? i : best), 0);

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b6b76', fontSize: 11 }}
        />
        <Bar dataKey="volume" radius={[6, 6, 6, 6]} maxBarSize={22}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === maxIndex ? '#c6f135' : '#2a2a32'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
