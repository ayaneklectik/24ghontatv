export default function PerformanceSection() {
  const metrics = [
    { label: 'Page Load Speed', value: '1.2s', status: 'Good' },
    { label: 'Server Latency', value: '45ms', status: 'Excellent' },
    { label: 'Core Web Vitals', value: '98/100', status: 'Optimal' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-black/5 shadow-sm h-full">
      <h2 className="text-lg font-bold text-black/80 mb-6">Site Performance</h2>
      <div className="space-y-6">
        {metrics.map((m, i) => (
          <div key={i} className="border-l-2 border-red-600 pl-4">
            <p className="text-xs text-black/40 font-bold uppercase">{m.label}</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-xl font-bold text-black/80">{m.value}</p>
              <span className="text-xs font-bold text-green-600">{m.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}