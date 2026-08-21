import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LineTrendChartProps {
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xKey: string;
  color?: string;
  unit?: string;
}

export function LineTrendChart({ data, dataKey, xKey, color = '#8b5cf6', unit = '' }: LineTrendChartProps) {
  const gradientId = `grad-${dataKey}`;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#2a2a32" vertical={false} />
        <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: '#6b6b76', fontSize: 11 }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b6b76', fontSize: 11 }}
          width={44}
          tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : `${v}`)}
        />
        <Tooltip
          contentStyle={{
            background: '#1c1c22',
            border: '1px solid #2a2a32',
            borderRadius: 12,
            fontSize: 13,
            color: '#f5f5f7',
          }}
          formatter={(value) => [`${value}${unit}`, '']}
          labelStyle={{ color: '#9a9aa5' }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
