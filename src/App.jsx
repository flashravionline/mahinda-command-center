import React, { useState, useEffect, useRef } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import EventPage from './components/EventPage';
import AllEventsPage from './components/AllEventsPage';
import UpdatesPage from './components/UpdatesPage';
import MyTicketsPage from './components/MyTicketsPage';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';

export default function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  

  const [theme, setTheme] = useState('dark');

  const ADMIN_EMAIL = 'admin@mahinda.lk';

  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#262523';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [theme]);

 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
        e.preventDefault();
        
        const user = currentUserRef.current;

        
        if (!user) {
          alert("Admin authentication required! Please sign in with admin credentials.");
          setIsAuthModalOpen(true);
        } 
      
        else if (user.email === ADMIN_EMAIL) {
          setCurrentView('admin');
          setSelectedEvent(null);
        } 
        
        else {
          alert("Access Denied: You do not have admin privileges.");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
       
        if (user.email === ADMIN_EMAIL) {
          setCurrentView('admin');
        }
      } else {
        setCurrentUser(null);
        if (currentView === 'admin' || currentView === 'myTickets') {
          setCurrentView('home'); 
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentView('home'); 
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-[#262523] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      <Navbar 
        currentView={currentView}
        onHomeClick={() => { setCurrentView('home'); setSelectedEvent(null); }}
        onEventsClick={() => { setCurrentView('events'); setSelectedEvent(null); }}
        onUpdatesClick={() => { setCurrentView('updates'); setSelectedEvent(null); }}
        onMyTicketsClick={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setCurrentView('myTickets'); 
            setSelectedEvent(null);
          }
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-grow">
        {currentView === 'home' && !selectedEvent ? (
          <HomePage 
            onRegisterClick={(event) => setSelectedEvent(event)} 
            theme={theme} 
          />
        ) : selectedEvent ? (
          <EventPage 
            event={selectedEvent} 
            currentUser={currentUser} 
            onOpenAuth={() => setIsAuthModalOpen(true)} 
            onBack={() => setSelectedEvent(null)} 
            theme={theme} 
          />
        ) : currentView === 'events' ? (
          <AllEventsPage 
            onRegisterClick={(event) => setSelectedEvent(event)} 
            theme={theme} 
          />
        ) : currentView === 'updates' ? (
          <UpdatesPage 
            currentUser={currentUser} 
            theme={theme} 
          />
        ) : currentView === 'myTickets' ? (
          <MyTicketsPage 
            currentUser={currentUser} 
            onBack={() => setCurrentView('home')} 
            theme={theme} 
          />
        ) : currentView === 'admin' ? (
          currentUser?.email === ADMIN_EMAIL ? (
            <AdminDashboard 
              onLogout={handleLogout} 
              theme={theme} 
            />
          ) : (
            <div className="flex items-center justify-center py-32">
              <div className="text-center bg-red-500/10 border border-red-500/30 p-10 rounded-2xl">
                <h2 className="text-3xl font-black text-red-500 mb-2">Access Denied!</h2>
                <p className="text-gray-400">You do not have permission to view this page.</p>
              </div>
            </div>
          )
        ) : null}
      </main>

      <Footer theme={theme} />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          if (user.email === ADMIN_EMAIL) {
            setCurrentView('admin');
          }
        }}
        theme={theme}
      />

    </div>
  );
}