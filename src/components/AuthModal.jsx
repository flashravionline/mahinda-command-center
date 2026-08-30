import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { X, Mail, Lock, User, Loader2, Shield } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
    
        await signInWithEmailAndPassword(auth, email, password);
      } else {
    
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        await updateProfile(user, { displayName: name });

        await set(ref(db, `users/${user.uid}`), {
          uid: user.uid,
          name: name,
          email: email,
          createdAt: new Date().toISOString()
        });
      }
      onClose();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#262523] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ffb900] to-[#FF9D09] flex items-center justify-center shadow-lg shadow-[#ffb900]/20 mb-3">
              <Shield className="w-7 h-7 text-slate-950" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-xs mt-1">Mahinda College Event Command Center</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#3A3937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#ffb900]" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#3A3937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#ffb900]" placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#3A3937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#ffb900]" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-70">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Register Now'}</span>}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-[#ffb900] font-bold hover:underline ml-1"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}