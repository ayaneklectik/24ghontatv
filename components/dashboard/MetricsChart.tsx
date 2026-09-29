'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', posts: 10, views: 2400 },
  { name: 'Tue', posts: 15, views: 3200 },
  { name: 'Wed', posts: 8, views: 2800 },
  { name: 'Thu', posts: 20, views: 4800 },
  { name: 'Fri', posts: 18, views: 3900 },
  { name: 'Sat', posts: 25, views: 5600 },
  { name: 'Sun', posts: 22, views: 4800 },
];

export default function MetricsChart() {
  return (
    <div className="bg-white p-6 rounded-lg border border-black/10 shadow-sm">
      <h2 className="text-lg font-bold text-black/80 mb-6">Traffic & Activity</h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="posts" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}