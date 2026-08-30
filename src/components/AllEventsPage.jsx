import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Search, Calendar, Filter, Loader2 } from 'lucide-react';
import EventCard from './EventCard';

export default function AllEventsPage({ onRegisterClick, theme }) {
  const isDark = theme === 'dark';
  
  const [events, setEvents] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  
  useEffect(() => {
    const eventsRef = ref(db, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEvents = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse();
        setEvents(loadedEvents);
      } else {
        setEvents([]); 
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen pt-6 pb-16 px-6 transition-colors duration-300 ${isDark ? 'bg-[#262523] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
       
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className={`text-3xl font-extrabold flex items-center justify-center md:justify-start gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Calendar className="w-8 h-8 text-[#ffb900]" />
              All Events
            </h2>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover and register for upcoming events at Mahinda College.
            </p>
          </div>
        </div>


        <div className={`p-4 rounded-2xl border shadow-sm mb-10 flex flex-col sm:flex-row items-center gap-4 transition-colors ${isDark ? 'bg-[#3A3937] border-gray-800' : 'bg-white border-gray-200'}`}>

          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search events by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#ffb900] transition-colors ${isDark ? 'bg-[#262523] border-gray-700 text-white placeholder-gray-500 border' : 'bg-slate-50 border-gray-300 text-slate-900 placeholder-gray-400 border'}`}
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#ffb900]" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full sm:w-48 pl-10 pr-8 py-3 rounded-xl text-sm focus:outline-none focus:border-[#ffb900] appearance-none transition-colors ${isDark ? 'bg-[#262523] border-gray-700 text-white border' : 'bg-slate-50 border-gray-300 text-slate-900 border'}`}
            >
              <option value="All">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Academic">Academic</option>
              <option value="Cultural">Cultural</option>
              <option value="Religious">Religious</option>
            </select>
          </div>
          
        </div>

        {isLoading ? (
          <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border ${isDark ? 'bg-[#3A3937]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <Loader2 className="w-10 h-10 text-[#ffb900] animate-spin mb-4" />
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border border-dashed ${isDark ? 'bg-[#3A3937]/30 border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500 shadow-sm'}`}>
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Events Found</h3>
            <p className="text-sm">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegister={onRegisterClick} 
                theme={theme} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}