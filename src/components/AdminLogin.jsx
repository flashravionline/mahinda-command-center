import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Shield, X, Loader2 } from 'lucide-react';

export default function AdminLogin({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err) {
      setError('Invalid admin credentials. Access denied.');
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
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-lg shadow-red-500/20 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Restricted Area</h2>
            <p className="text-gray-400 text-sm mt-1">Authorized Personnel Only</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Admin Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#3A3937] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition" placeholder="admin@mahinda.lk" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#3A3937] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Authenticate</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}