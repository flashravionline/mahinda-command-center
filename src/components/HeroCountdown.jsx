import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket, Flame } from 'lucide-react';

export default function HeroCountdown({ events, onRegisterClick }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    if (!events || events.length === 0) return;

    const now = new Date().getTime();
    
    const upcomingEvents = events
      .map(e => {
        const eventTime = e.time || '00:00';
        return {
          ...e,
          timestamp: new Date(`${e.date}T${eventTime}:00`).getTime()
        };
      })
      .filter(e => e.timestamp > now) 
      .sort((a, b) => a.timestamp - b.timestamp); 

    if (upcomingEvents.length > 0) {
      setNextEvent(upcomingEvents[0]); 
    } else {
      setNextEvent(null);
    }
  }, [events]);


  useEffect(() => {
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextEvent.timestamp - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

 
  if (!nextEvent) return null; 

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#ffb900]/30 bg-[#3A3937] shadow-2xl p-6 sm:p-10 mb-12">

      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffb900]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9D09]/10 border border-[#FF9D09]/30 text-[#FF9D09] text-xs font-bold uppercase tracking-wider mb-4">
            <Flame className="w-4 h-4" /> Upcoming {nextEvent.category} Event
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {nextEvent.title}
          </h2>
          <p className="text-gray-300 mt-3 text-base sm:text-lg line-clamp-2">
            {nextEvent.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ffb900]" />
              <span>{nextEvent.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ffb900]" />
              <span>{nextEvent.venue}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center bg-[#262523]/80 border border-[#ffb900]/20 p-6 rounded-xl w-full lg:w-auto shrink-0">
          <p className="text-xs uppercase tracking-widest text-[#ffb900] font-semibold mb-3">Time Remaining</p>
          
          <div className="grid grid-cols-4 gap-3 text-center mb-6">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Mins' },
              { val: timeLeft.seconds, label: 'Secs' },
            ].map((t, idx) => (
              <div key={idx} className="bg-[#3A3937] p-3 rounded-lg border border-gray-700 min-w-[65px]">
                <div className="text-2xl font-black text-white">{t.val.toString().padStart(2, '0')}</div>
                <div className="text-[10px] text-gray-400 uppercase">{t.label}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onRegisterClick(nextEvent)}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-lg shadow-lg hover:brightness-110 transition active:scale-95"
          >
            <Ticket className="w-5 h-5" />
            <span>Get Gate Pass</span>
          </button>
        </div>

      </div>
    </div>
  );
}