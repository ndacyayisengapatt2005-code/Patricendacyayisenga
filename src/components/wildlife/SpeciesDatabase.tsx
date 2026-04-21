import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Info, MapPin, Heart, ChevronRight } from 'lucide-react';
import { INITIAL_SPECIES_DATA } from '@/src/constants';
import { Species } from '@/src/types';
import { cn } from '@/src/lib/utils';

export default function SpeciesDatabase({ onTrack }: { onTrack: (coords: [number, number]) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPark, setSelectedPark] = useState<string>('All');

  const filteredData = INITIAL_SPECIES_DATA.filter(item => 
    (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedPark === 'All' || item.location.park === selectedPark)
  );

  const parks = ['All', 'Volcanoes National Park', 'Akagera National Park', 'Nyungwe Forest National Park'];

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Wildlife Database</h1>
        <p className="text-slate-400">Explore and manage documented species across Rwanda's protected areas.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search species..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {parks.map(park => (
            <button
              key={park}
              onClick={() => setSelectedPark(park)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                selectedPark === park 
                  ? "bg-slate-800 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {park === 'All' ? 'All Areas' : park.replace(' National Park', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filteredData.map((species, index) => (
          <SpeciesCard 
            key={species.id} 
            species={species} 
            index={index} 
            onTrack={() => onTrack([species.location.lng, species.location.lat])} 
          />
        ))}
      </div>
    </div>
  );
}

function SpeciesCard({ species, index, onTrack }: { species: Species; index: number; onTrack: () => void; [key: string]: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group glass-panel rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={species.imageUrl} 
          alt={species.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
            species.status === 'Endangered' ? "bg-red-500/20 text-red-400 border border-red-500/30" : 
            species.status === 'Vulnerable' ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
            "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          )}>
            {species.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">{species.name}</h3>
            <p className="text-xs italic text-slate-400 font-mono">{species.scientificName}</p>
          </div>
          <button className="text-slate-500 hover:text-red-400 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {species.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{species.location.park}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2 rounded-lg">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>{species.behavior}</span>
          </div>
        </div>

        <button 
          onClick={onTrack}
          className="w-full py-3 bg-slate-800/50 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 group/btn"
        >
          Track in Real-time
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
