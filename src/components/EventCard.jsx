import React from 'react';
import { Calendar, MapPin, Users, ArrowRight, Ticket } from 'lucide-react';

export default function EventCard({ event, onRegister }) {

  const registeredCount = event.registeredCount || 0;
  const maxCapacity = Number(event.maxCapacity) || 100;
  const isSoldOut = registeredCount >= maxCapacity;

  return (
    <div className="bg-[#3A3937] rounded-xl overflow-hidden border border-gray-800 hover:border-[#ffb900]/40 transition duration-300 flex flex-col group shadow-lg">

      <div className="relative h-48 w-full overflow-hidden bg-[#262523]">
        <img 
          src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60"} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
        />
  
        <div className="absolute top-3 left-3 bg-[#262523]/80 backdrop-blur-md border border-[#ffb900]/30 px-2.5 py-1 rounded-md text-xs font-bold text-[#ffb900]">
          {event.category || "Event"}
        </div>

  
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md border ${
          isSoldOut 
            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        }`}>
          {isSoldOut ? 'Sold Out' : (event.status || 'Upcoming')}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-[#ffb900] transition line-clamp-1">
            {event.title}
          </h3>
          <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-4 space-y-2 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#ffb900] shrink-0" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF9D09] shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users className="w-3.5 h-3.5 text-[#ffb900]" />
            <span><strong className="text-white">{registeredCount}</strong> / {maxCapacity} Attending</span>
          </div>

          <button 
            onClick={() => !isSoldOut && onRegister(event)}
            disabled={isSoldOut}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-semibold text-xs rounded-lg transition border ${
              isSoldOut 
                ? 'bg-gray-700/50 text-gray-500 border-gray-700 cursor-not-allowed' 
                : 'bg-[#ffb900]/10 hover:bg-[#ffb900] text-[#ffb900] hover:text-slate-950 border-[#ffb900]/30 active:scale-95'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isSoldOut ? 'Sold Out' : 'Register'}</span>
            {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </div>
  );
}