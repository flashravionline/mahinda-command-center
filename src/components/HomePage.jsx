import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Loader2, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import EventCard from './EventCard';

export default function HomePage({ onRegisterClick, theme }) {
  const isDark = theme === 'dark';
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEvents = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        const upcoming = loadedEvents.filter(ev => new Date(ev.date) >= new Date().setHours(0,0,0,0));
        
        setFeaturedEvents(upcoming.slice(0, 4));
        
        if (upcoming.length > 0) {
          setNextEvent(upcoming[0]); 
        }
      } else {
        setFeaturedEvents([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!nextEvent || !nextEvent.date) return;

    const targetDate = new Date(`${nextEvent.date}T${nextEvent.time || '00:00'}:00`);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(interval);
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  
  const getCalendarDate = (dateString) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return { month: 'TBA', day: '--' };
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        day: d.getDate()
      };
    } catch {
      return { month: 'TBA', day: '--' };
    }
  };

  return (
    <div className={`transition-colors duration-300 ${isDark ? 'bg-[#262523]' : 'bg-slate-50'}`}>

      <div className="relative overflow-hidden w-full min-h-[85vh] flex items-center justify-center pt-20 pb-16">
    
        <div className="absolute inset-0 z-0">
          <img 
            src="https://play-lh.googleusercontent.com/2mAO4BfROAB-51fq1ShqK2oZI_frl5nLvkPEVKKSn0QNHyI-X_689ZXShPj4IfrGfg=w3840-h2160-rw" 
            alt="College Events" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#262523] via-[#262523]/85 to-[#262523]/50' : 'bg-gradient-to-t from-slate-50 via-slate-50/90 to-white/70'}`}></div>
        </div>

 
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 backdrop-blur-md border ${isDark ? 'bg-[#ffb900]/10 border-[#ffb900]/30 text-[#ffb900]' : 'bg-[#ffb900]/20 border-[#ffb900]/50 text-amber-700 shadow-sm'}`}>
            <Sparkles className="w-4 h-4" />
            <span>Welcome to the Command Center</span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Experience the True <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb900] to-[#FF9D09]">Mahindian Spirit</span>
          </h1>
          
          <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Reserve your gate passes, catch live match updates, and explore the biggest college events all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button 
              onClick={() => document.getElementById('events-section').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-black rounded-xl shadow-xl shadow-[#ffb900]/20 hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {nextEvent && (
            <div className={`inline-block p-1 rounded-3xl backdrop-blur-md border shadow-2xl transition-colors ${isDark ? 'bg-black/40 border-[#ffb900]/20' : 'bg-white/60 border-white/40 shadow-gray-200'}`}>
              <div className={`px-6 py-4 rounded-2xl ${isDark ? 'bg-[#262523]/80' : 'bg-white/80'}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2 ${isDark ? 'text-[#ffb900]' : 'text-amber-600'}`}>
                  <Clock className="w-4 h-4" /> Next Big Event: <span className={isDark ? 'text-white' : 'text-slate-900'}>{nextEvent.title}</span>
                </p>
                <div className="flex gap-4 md:gap-6 justify-center">
                  {[
                    { label: 'Days', value: timeLeft.d },
                    { label: 'Hours', value: timeLeft.h },
                    { label: 'Mins', value: timeLeft.m },
                    { label: 'Secs', value: timeLeft.s }
                  ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-xl md:rounded-2xl border shadow-inner mb-2 ${isDark ? 'bg-[#3A3937] border-gray-700' : 'bg-slate-100 border-gray-200'}`}>
                        <span className={`text-2xl md:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {unit.value.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div id="events-section" className="max-w-7xl mx-auto px-6 py-20 relative z-20">
        
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className={`text-3xl font-black flex items-center gap-3 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Ticket className="w-8 h-8 text-[#ffb900]" />
              Upcoming Events
            </h2>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Reserve your passes for these spectacular activities</p>
          </div>
        </div>

        {isLoading ? (
          <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border ${isDark ? 'bg-[#3A3937]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <Loader2 className="w-10 h-10 text-[#ffb900] animate-spin mb-4" />
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading amazing events...</p>
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border border-dashed ${isDark ? 'bg-[#3A3937]/30 border-gray-700 text-gray-400' : 'bg-white border-gray-300 text-gray-500 shadow-sm'}`}>
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Upcoming Events</h3>
            <p className="text-sm">Stay tuned! New events will be published here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredEvents.slice(0, 4).map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onRegister={onRegisterClick} 
                  theme={theme}
                />
              ))}
            </div>
    
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-2xl border sticky top-28 ${isDark ? 'bg-[#3A3937] border-gray-800 shadow-lg' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 border-b pb-4 ${isDark ? 'text-white border-gray-700' : 'text-slate-800 border-gray-100'}`}>
                  <Calendar className="w-5 h-5 text-[#ffb900]" />
                  Event Calendar
                </h3>
                
                <div className="space-y-4">
                  {featuredEvents.map((event) => {
                    const { month, day } = getCalendarDate(event.date);
                    return (
                      <div 
                        key={event.id} 
                        className={`group flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${isDark ? 'bg-[#262523] border-gray-700 hover:border-[#ffb900]/40' : 'bg-slate-50 border-gray-200 hover:border-[#ffb900]/50 hover:shadow-sm'}`}
                        onClick={() => onRegisterClick(event)}
                      >
                        <div className="flex flex-col items-center justify-center bg-[#ffb900] text-slate-900 rounded-lg min-w-[55px] h-14 shadow-sm group-hover:scale-105 transition-transform">
                          <span className="text-[10px] font-black uppercase tracking-widest">{month}</span>
                          <span className="text-xl font-black leading-none">{day}</span>
                        </div>
                        
                        <div className="overflow-hidden flex-1">
                          <h4 className={`font-bold text-sm truncate transition-colors ${isDark ? 'text-white group-hover:text-[#ffb900]' : 'text-slate-800 group-hover:text-amber-600'}`}>
                            {event.title}
                          </h4>
                          <div className={`flex items-center gap-3 mt-1.5 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#ffb900]" />{event.time}</span>
                            <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-[#ffb900]" />{event.venue}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <button 
                  className={`w-full mt-6 py-3 rounded-xl text-sm font-bold border transition-colors ${isDark ? 'bg-[#262523] border-[#ffb900]/30 text-[#ffb900] hover:bg-[#ffb900] hover:text-slate-900' : 'bg-amber-50 border-[#ffb900]/40 text-amber-700 hover:bg-[#ffb900] hover:text-slate-900'}`}
                >
                  View Full Schedule
                </button>
              </div>
            </div>
            
          </div>
        )}
      </div>

    </div>
  );
}