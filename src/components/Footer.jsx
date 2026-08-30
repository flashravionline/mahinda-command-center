import React from 'react';
import { MapPin, Phone, Mail, Globe, Share2, MessageCircle, PlayCircle } from 'lucide-react';

export default function Footer({ theme }) {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t transition-colors duration-300 pt-12 pb-6 ${isDark ? 'bg-[#262523] border-[#ffb900]/20 text-gray-400' : 'bg-slate-100 border-gray-200 text-slate-600'}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Section */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={isDark ? '/WhiteCrest.png' : '/BlackCrest.png'} 
              alt="Mahinda College Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h2 className={`text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                MAHINDA COLLEGE <span className="text-[#ffb900]">GALLE</span>
              </h2>
              <p className="text-sm">Digital Event Command Center</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-md">
            The official digital platform for managing and exploring all events, tickets, and live updates of Mahinda College, Galle. Proudly maintaining the true Mahindian spirit since 1892.
          </p>
        </div>

        <div>
          <h3 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#ffb900] transition">Upcoming Events</a></li>
            <li><a href="#" className="hover:text-[#ffb900] transition">Live Score & Updates</a></li>
            <li><a href="#" className="hover:text-[#ffb900] transition">Ticket Verification</a></li>
            <li><a href="#" className="hover:text-[#ffb900] transition">College Website</a></li>
          </ul>
        </div>

        <div>
          <h3 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#ffb900] shrink-0 mt-0.5" />
              <span>Mahinda College, Elliot Road, Galle, Sri Lanka.</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#ffb900] shrink-0" />
              <span>+94 91 22 22123</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#ffb900] shrink-0" />
              <span>info@mahindacollege.lk</span>
            </li>
          </ul>
        </div>

      </div>

      <div className={`max-w-7xl mx-auto px-6 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
        <p>© {new Date().getFullYear()} Mahinda College Galle. All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" title="Social Media" className="hover:text-[#ffb900] transition"><Share2 className="w-4 h-4" /></a>
          <a href="#" title="Community" className="hover:text-[#ffb900] transition"><MessageCircle className="w-4 h-4" /></a>
          <a href="#" title="Channel" className="hover:text-[#ffb900] transition"><PlayCircle className="w-4 h-4" /></a>
          <a href="#" title="Website" className="hover:text-[#ffb900] transition"><Globe className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );
}