import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { Ticket, Search, Printer, User, Mail, Phone, Loader2, LogIn } from 'lucide-react';

export default function MyTicketsPage({ currentUser, onOpenAuth }) {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.email) {
      fetchTickets(currentUser.email);
    }
  }, [currentUser]);

  const fetchTickets = async (emailToSearch) => {
    setIsLoading(true);
    try {
      const regRef = ref(db, 'registrations');
      const snapshot = await get(regRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const allTickets = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        const matched = allTickets.filter(t => t.email && t.email.toLowerCase() === emailToSearch.toLowerCase());
        setTickets(matched);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchTickets(searchQuery.trim());
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#262523] text-white pt-6 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        
     
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#ffb900]/10 border border-[#ffb900]/30 flex items-center justify-center mx-auto mb-4 text-[#ffb900]">
            <Ticket className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">My Gate Passes</h2>
          <p className="text-gray-400 mt-2 text-sm">
            {currentUser ? `Showing passes registered under: ${currentUser.email}` : "Sign in to view your tickets instantly, or search below."}
          </p>
        </div>

      
        {!currentUser && (
          <div className="bg-[#3A3937] border border-[#ffb900]/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-white mb-1">Want to manage your tickets easily?</h4>
              <p className="text-xs text-gray-400">Sign in with your account to see all your purchases in one place.</p>
            </div>
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ffb900] text-slate-950 font-bold rounded-xl text-sm shrink-0 hover:bg-[#FF9D09] transition"
            >
              <LogIn className="w-4 h-4" /> Sign In / Register
            </button>
          </div>
        )}

   
        <div className="bg-[#3A3937] p-6 rounded-2xl border border-gray-800 shadow-xl mb-10">
          <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ticket ID or Email..."
                className="w-full bg-[#262523] border border-gray-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-[#ffb900] text-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition text-sm flex items-center justify-center gap-2 shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Search Pass</span>}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-[#ffb900] animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading passes...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-[#3A3937]/40 border border-gray-800 border-dashed rounded-2xl p-10 text-center text-gray-400">
              <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-bold text-white mb-1">No Gate Passes Found</p>
              <p className="text-sm">You have not purchased any passes yet, or no records matched your search.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-[#3A3937] border-2 border-[#ffb900]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black">
                
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#ffb900] to-[#FF9D09] text-slate-950 px-6 py-1.5 rounded-bl-2xl font-bold text-xs uppercase tracking-wider">
                  {ticket.paymentStatus || "Confirmed"}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-700/60 pb-6 mb-6">
                  <div>
                    <span className="text-xs text-[#ffb900] print:text-amber-700 font-bold uppercase tracking-widest">Mahinda College Event Pass</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white print:text-black mt-1">{ticket.eventTitle}</h3>
                  </div>
                  <div className="bg-[#262523] print:bg-gray-100 px-4 py-2.5 rounded-xl border border-gray-700 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Ticket ID</p>
                    <p className="text-lg font-mono font-bold text-[#ffb900] print:text-black">{ticket.ticketId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm text-gray-300 print:text-gray-800">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#ffb900]" />
                    <span><strong>Name:</strong> {ticket.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#ffb900]" />
                    <span><strong>Email:</strong> {ticket.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span><strong>Phone:</strong> {ticket.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Ticket className="w-4 h-4 text-[#ffb900]" />
                    <span><strong>Role & Price:</strong> {ticket.role} ({ticket.amountPaid})</span>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-700/60 print:hidden">
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-[#ffb900] hover:bg-[#FF9D09] text-slate-950 font-bold rounded-xl shadow-lg transition active:scale-95 text-sm"
                  >
                    <Printer className="w-4 h-4" /> Print / Save Ticket
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}