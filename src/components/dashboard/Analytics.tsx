import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, Map as MapIcon, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const populationData = [
  { month: 'Jan', gorillas: 604, elephants: 120, chimps: 450 },
  { month: 'Feb', gorillas: 608, elephants: 122, chimps: 452 },
  { month: 'Mar', gorillas: 612, elephants: 121, chimps: 455 },
  { month: 'Apr', gorillas: 615, elephants: 125, chimps: 460 },
  { month: 'May', gorillas: 620, elephants: 128, chimps: 462 },
  { month: 'Jun', gorillas: 625, elephants: 130, chimps: 465 },
];

const distributionData = [
  { name: 'Volcanoes', value: 45, color: '#10B981' },
  { name: 'Akagera', value: 30, color: '#F59E0B' },
  { name: 'Nyungwe', value: 25, color: '#3B82F6' },
];

export default function Dashboard() {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto hide-scrollbar">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
          <p className="text-slate-400">Real-time metrics and population analytics across protected territories.</p>
        </div>
        <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button className="px-4 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm">Real-time</button>
          <button className="px-4 py-1.5 text-slate-500 text-xs font-bold rounded-lg hover:text-slate-300">Historical</button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Tracked Animals" 
          value="1,248" 
          change="+4.2%" 
          trend="up" 
          icon={Activity} 
          color="emerald" 
        />
        <StatCard 
          label="Active Sensors" 
          value="482" 
          change="+12" 
          trend="up" 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          label="Protected Territory" 
          value="3.2k km²" 
          change="0.0%" 
          trend="neutral" 
          icon={MapIcon} 
          color="orange" 
        />
        <StatCard 
          label="Critial Incidents" 
          value="0" 
          change="-2" 
          trend="down" 
          icon={ShieldAlert} 
          color="red" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
        {/* Population Trends */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Population Trajectory</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Gorillas
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Chimps
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={populationData}>
                <defs>
                  <linearGradient id="colorGorillas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChimps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="gorillas" stroke="#10B981" fillOpacity={1} fill="url(#colorGorillas)" strokeWidth={3} />
                <Area type="monotone" dataKey="chimps" stroke="#3B82F6" fillOpacity={1} fill="url(#colorChimps)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Territory Distribution */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6">Area Distribution</h3>
          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-300">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, trend, icon: Icon, color }: any) {
  const colors: any = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="glass-panel p-5 rounded-3xl hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full",
          trend === 'up' ? "bg-emerald-500/10 text-emerald-500" :
          trend === 'down' ? "bg-red-500/10 text-red-500" :
          "bg-slate-800 text-slate-500"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
           trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
          {change}
        </div>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
        <h4 className="text-2xl font-black text-white">{value}</h4>
      </div>
    </div>
  );
}
