import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, LayoutDashboard, Database, Camera, Search, User, Bell, Settings, Languages, Sun, Moon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import MapContainer from './components/map/MapContainer';
import SpeciesDatabase from './components/wildlife/SpeciesDatabase';
import AIVision from './components/ai/AIVision';
import Dashboard from './components/dashboard/Analytics';

type Tab = 'map' | 'database' | 'ai' | 'dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('map');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [focusedLocation, setFocusedLocation] = useState<[number, number] | null>(null);

  const navigation = [
    { id: 'map', label: 'Monitor', icon: Map },
    { id: 'database', label: 'Species', icon: Database },
    { id: 'ai', label: 'AI Vision', icon: Camera },
    { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
  ];

  const handleTrackWildlife = (coords: [number, number]) => {
    setFocusedLocation(coords);
    setActiveTab('map');
  };

  return (
    <div className={cn("flex h-screen w-full overflow-hidden", isDarkMode ? "dark bg-slate-950" : "bg-slate-50")}>
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 flex flex-col border-r border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <span className="hidden md:block text-xl font-bold tracking-tight text-white">Ecotrackr</span>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:block font-medium">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="nav-pill"
                  className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800/50 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors">
            <Languages className="w-5 h-5" />
            <span className="hidden md:block text-sm">Kinyarwanda</span>
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="hidden md:block text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-900/10">
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search wildlife, locations, sensors..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-800/30 border border-slate-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </button>
            <div className="h-8 w-px bg-slate-800" />
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-200">Admin Panel</span>
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'map' && <MapContainer focusedLocation={focusedLocation} />}
              {activeTab === 'database' && <SpeciesDatabase onTrack={handleTrackWildlife} />}
              {activeTab === 'ai' && <AIVision />}
              {activeTab === 'dashboard' && <Dashboard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Mountain(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
    </svg>
  );
}
