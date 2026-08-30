import React from 'react';
import { Home, Calendar, Zap, Ticket, User, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar({ currentView, onHomeClick, onEventsClick, onUpdatesClick, onMyTicketsClick, currentUser, onOpenAuth, onLogout, theme, toggleTheme }) {
  const isDark = theme === 'dark';


  const getTabClass = (viewName) => {
    const baseClass = "flex items-center gap-2 text-sm font-bold transition-all duration-300 pb-1 border-b-2";
    if (currentView === viewName) {
      return `${baseClass} text-[#ffb900] border-[#ffb900]`;
    }
    return `${baseClass} border-transparent ${isDark ? 'text-gray-300 hover:text-[#ffb900]' : 'text-gray-500 hover:text-[#FF9D09]'}`;
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 transition-colors duration-300 ${isDark ? 'bg-[#3A3937]/90 border-[#ffb900]/20' : 'bg-white/90 border-gray-200 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        

        <div className="flex items-center gap-3 cursor-pointer group" onClick={onHomeClick}>
          <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img 
              src={isDark ? '/WhiteCrest.png' : '/BlackCrest.png'} 
              alt="Mahinda College Logo" 
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-wide leading-tight transition-colors duration-300 ${isDark ? 'text-white group-hover:text-[#ffb900]' : 'text-slate-900 group-hover:text-[#FF9D09]'}`}>
              MAHINDA COLLEGE <span className="text-[#ffb900]">GALLE</span>
            </h1>
            <p className={`text-xs font-medium transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Digital Event Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-6">

          <div className="hidden md:flex items-center gap-6">
            <button onClick={onHomeClick} className={getTabClass('home')}>
              <Home className="w-4 h-4" /> Home
            </button>
            <button onClick={onEventsClick} className={getTabClass('events')}>
              <Calendar className="w-4 h-4" /> Events
            </button>
            <button onClick={onUpdatesClick} className={getTabClass('updates')}>
              <Zap className="w-4 h-4" /> Updates
            </button>
            <button onClick={onMyTicketsClick} className={getTabClass('myTickets')}>
              <Ticket className="w-4 h-4" /> My Tickets
            </button>
          </div>

          <div className="flex items-center gap-4 border-l pl-4 border-gray-500/30">
            {currentUser ? (
              <div className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition-colors ${isDark ? 'bg-[#262523] border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                <div className="w-7 h-7 rounded-lg bg-[#ffb900]/20 text-[#FF9D09] flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {currentUser.displayName || currentUser.email}
                </span>
                <button onClick={onLogout} title="Sign Out" className="text-red-400 hover:text-red-500 transition ml-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="px-4 py-2 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-xl text-xs shadow-md hover:brightness-110 transition"
              >
                Sign In
              </button>
            )}

            <button 
              onClick={toggleTheme} 
              title="Switch Theme"
              className={`p-2 rounded-xl border transition-all duration-300 ${isDark ? 'bg-[#262523] border-gray-700 text-[#ffb900] hover:bg-gray-700' : 'bg-slate-100 border-gray-300 text-slate-700 hover:bg-slate-200 shadow-inner'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}