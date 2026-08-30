import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { Radio, Zap, Image as ImageIcon, Trophy, Clock, AlertCircle, Send, Loader2, Sparkles, Users, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

export default function UpdatesPage({ currentUser, theme }) {
  const isDark = theme === 'dark';

  const [announcements, setAnnouncements] = useState([]);
  const [liveScore, setLiveScore] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState('info');
  const [isPosting, setIsPosting] = useState(false);

  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const annRef = ref(db, 'announcements');
    const scoreRef = ref(db, 'liveScore');
    const highlightsRef = ref(db, 'highlights');

    const unsubAnn = onValue(annRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setAnnouncements(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
      else setAnnouncements([]);
      setIsLoading(false);
    });

    const unsubScore = onValue(scoreRef, (snapshot) => setLiveScore(snapshot.val()));

    const unsubHighlights = onValue(highlightsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setHighlights(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
      else setHighlights([]);
    });

    return () => { unsubAnn(); unsubScore(); unsubHighlights(); };
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setIsPosting(true);
    try {
      await set(push(ref(db, 'announcements')), {
        text: newText.trim(), type: newType, time: "Just now", timestamp: serverTimestamp(), author: currentUser?.displayName || currentUser?.email || 'Admin'
      });
      setNewText('');
    } catch (error) { alert("Failed to post."); } 
    finally { setIsPosting(false); }
  };

  useEffect(() => {
    let timer;
    if (selectedGallery && selectedGallery.images?.length > 1) {
      timer = setInterval(() => setCurrentSlideIndex((prev) => (prev + 1) % selectedGallery.images.length), 3500);
    }
    return () => clearInterval(timer);
  }, [selectedGallery]);

  const nextSlide = () => { if (selectedGallery) setCurrentSlideIndex((prev) => (prev + 1) % selectedGallery.images.length); };
  const prevSlide = () => { if (selectedGallery) setCurrentSlideIndex((prev) => (prev === 0 ? selectedGallery.images.length - 1 : prev - 1)); };
  const closeGallery = () => { setSelectedGallery(null); setCurrentSlideIndex(0); };

  return (
    <div className={`min-h-screen pt-6 pb-16 px-6 relative transition-colors duration-300 ${isDark ? 'bg-[#262523] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h2 className={`text-3xl font-extrabold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Radio className="w-8 h-8 text-[#ffb900]" /> Live Updates & Highlights
          </h2>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Real-time scores, announcements, and moments from Mahinda College events.</p>
        </div>

        {currentUser && (
          <div className={`p-6 rounded-2xl border shadow-xl mb-10 transition-colors ${isDark ? 'bg-[#3A3937] border-[#ffb900]/30' : 'bg-white border-[#ffb900]/40'}`}>
            <h3 className="text-sm font-bold text-[#ffb900] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Post Flash Announcement (Admin / Staff)
            </h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <select value={newType} onChange={(e) => setNewType(e.target.value)} className={`w-full sm:w-1/3 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffb900] transition-colors ${isDark ? 'bg-[#262523] border-gray-700 text-white' : 'bg-slate-50 border-gray-300 text-slate-900'}`}>
                <option value="info">Info Announcement</option>
                <option value="alert">Alert / Urgent</option>
              </select>
              <textarea rows="2" value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Type flash announcement here..." className={`w-full rounded-xl p-4 text-sm focus:outline-none focus:border-[#ffb900] resize-none transition-colors ${isDark ? 'bg-[#262523] border-gray-700 text-white' : 'bg-slate-50 border-gray-300 text-slate-900'}`} required></textarea>
              <div className="flex justify-end">
                <button type="submit" disabled={isPosting} className="px-6 py-3 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2 disabled:opacity-70">
                  {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /><span>Publish</span></>}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {liveScore && liveScore.isLive ? (
              <div className={`rounded-2xl p-1 relative overflow-hidden border shadow-[0_0_20px_rgba(255,185,0,0.15)] transition-colors ${isDark ? 'bg-[#3A3937] border-[#ffb900]/30' : 'bg-white border-[#ffb900]/40'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb900]/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className={`rounded-xl p-6 relative z-10 transition-colors ${isDark ? 'bg-[#262523]' : 'bg-slate-50'}`}>
                  <div className={`flex justify-between items-center mb-6 border-b pb-4 ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#ffb900]" />
                      <h3 className={`font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{liveScore.matchTitle}</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-500/20">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {liveScore.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className={`text-center sm:text-left flex-1 p-3 rounded-xl transition-all duration-300 ${liveScore.battingTeam === 'team1' ? (isDark ? 'bg-[#ffb900]/10 border border-[#ffb900]/50 shadow-[0_0_15px_rgba(255,185,0,0.1)]' : 'bg-[#ffb900]/10 border border-[#ffb900]') : 'border border-transparent'}`}>
                      <p className={`text-sm mb-1 font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2 ${liveScore.battingTeam === 'team1' ? 'text-[#ffb900]' : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                        {liveScore.team1Name}
                        {liveScore.battingTeam === 'team1' && <span className="bg-[#ffb900] text-slate-900 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest">BATTING</span>}
                      </p>
                      <p className={`text-4xl font-black ${liveScore.battingTeam === 'team1' ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-gray-300' : 'text-slate-600')}`}>{liveScore.team1Score}</p>
                      {liveScore.team1Details && <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{liveScore.team1Details}</p>}
                    </div>
                    
                    <div className={`text-xl font-bold px-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>VS</div>
                    
                    <div className={`text-center sm:text-right flex-1 p-3 rounded-xl transition-all duration-300 ${liveScore.battingTeam === 'team2' ? (isDark ? 'bg-[#ffb900]/10 border border-[#ffb900]/50 shadow-[0_0_15px_rgba(255,185,0,0.1)]' : 'bg-[#ffb900]/10 border border-[#ffb900]') : 'border border-transparent'}`}>
                      <p className={`text-sm mb-1 font-bold uppercase tracking-widest flex items-center justify-center sm:justify-end gap-2 ${liveScore.battingTeam === 'team2' ? 'text-[#ffb900]' : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                        {liveScore.battingTeam === 'team2' && <span className="bg-[#ffb900] text-slate-900 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest">BATTING</span>}
                        {liveScore.team2Name}
                      </p>
                      <p className={`text-4xl font-black ${liveScore.battingTeam === 'team2' ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-gray-300' : 'text-slate-600')}`}>{liveScore.team2Score}</p>
                      {liveScore.team2Details && <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{liveScore.team2Details}</p>}
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl p-4 border transition-colors ${isDark ? 'bg-[#3A3937]/50 border-gray-700/50' : 'bg-slate-100 border-gray-200'}`}>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        <Users className="w-3.5 h-3.5 text-emerald-500" /> Active Players
                      </div>
                      {liveScore.activePlayer1 && <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>• {liveScore.activePlayer1}</p>}
                      {liveScore.activePlayer2 && <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>• {liveScore.activePlayer2}</p>}
                      <div className="text-xs text-[#FF9D09] font-semibold mt-2">{liveScore.partnership}</div>
                    </div>
                    
                    <div className={`md:border-l md:pl-4 transition-colors ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Current Bowler & Over</div>
                      {liveScore.activeOpponent && <p className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>• {liveScore.activeOpponent}</p>}
                      
                      {liveScore.currentOverDetails && (
                        <div className={`p-2.5 rounded-lg border inline-block w-full transition-colors ${isDark ? 'bg-[#262523] border-gray-700' : 'bg-white border-gray-300 shadow-sm'}`}>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2">This Over</span>
                          <div className="flex gap-2 flex-wrap">
                            {liveScore.currentOverDetails.split(/[\s,]+/).filter(Boolean).map((ball, i) => (
                              <span key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shadow-md ${
                                ball.toUpperCase() === 'W' ? 'bg-red-500 text-white' : 
                                (ball === '4' || ball === '6') ? 'bg-emerald-500 text-white' : 
                                (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-slate-700')
                              }`}>
                                {ball.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-10 rounded-2xl border text-center shadow-xl transition-colors ${isDark ? 'bg-[#3A3937] border-gray-800' : 'bg-white border-gray-200'}`}>
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-40" />
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Active Live Matches</h3>
                <p className={isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>There are no live scores being broadcasted right now.</p>
              </div>
            )}

            <div className={`p-6 rounded-2xl border transition-colors ${isDark ? 'bg-[#3A3937] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <Zap className="w-5 h-5 text-[#FF9D09]" /> Flash Announcements
              </h3>
              
              {isLoading ? (
                <div className="text-center py-8"><Loader2 className="w-6 h-6 text-[#ffb900] animate-spin mx-auto mb-2" /><p className="text-gray-400 text-xs">Loading...</p></div>
              ) : announcements.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No flash announcements posted yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <div key={item.id} className={`flex gap-4 p-4 rounded-xl border hover:border-[#ffb900]/40 transition ${isDark ? 'bg-[#262523] border-gray-700' : 'bg-slate-50 border-gray-200'}`}>
                      <div className="mt-1">{item.type === 'alert' ? <AlertCircle className="w-5 h-5 text-red-500" /> : <Clock className="w-5 h-5 text-[#ffb900]" />}</div>
                      <div>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>{item.text}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500 font-medium">By {item.author || 'Admin'}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-[#ffb900] font-medium">Live Update</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`p-6 rounded-2xl border h-fit transition-colors ${isDark ? 'bg-[#3A3937] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className={`text-xl font-bold flex items-center gap-2 mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <ImageIcon className="w-5 h-5 text-[#ffb900]" /> Recent Highlights
            </h3>
            
            {highlights.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No highlights posted yet.</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {highlights.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => { setSelectedGallery(item); setCurrentSlideIndex(0); }}
                    className={`relative group rounded-xl overflow-hidden cursor-pointer border shadow-md aspect-video ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-sm font-bold text-white leading-tight line-clamp-2">{item.title}</p>
                      {item.images?.length > 1 && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black tracking-wider uppercase bg-[#ffb900]/20 text-[#ffb900] px-2 py-0.5 rounded">
                          <Images className="w-3 h-3" /> {item.images.length} Photos
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedGallery && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
            <div>
              <h3 className="text-white font-bold text-lg md:text-xl">{selectedGallery.title}</h3>
              <p className="text-[#ffb900] text-xs font-semibold tracking-wider mt-1 uppercase">Photo {currentSlideIndex + 1} of {selectedGallery.images.length}</p>
            </div>
            <button onClick={closeGallery} className="p-2 bg-gray-800/50 hover:bg-red-500 rounded-full text-gray-300 hover:text-white transition"><X className="w-6 h-6" /></button>
          </div>

          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center overflow-hidden">
            {selectedGallery.images.map((imgUrl, idx) => (
              <img key={idx} src={imgUrl} alt={`Slide ${idx}`} className={`absolute w-full h-full object-contain transition-all duration-1000 ease-in-out ${idx === currentSlideIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`} />
            ))}
            {selectedGallery.images.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 md:left-10 z-50 p-3 bg-black/50 hover:bg-[#ffb900] text-white hover:text-black rounded-full backdrop-blur-md transition"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={nextSlide} className="absolute right-4 md:right-10 z-50 p-3 bg-black/50 hover:bg-[#ffb900] text-white hover:text-black rounded-full backdrop-blur-md transition"><ChevronRight className="w-6 h-6" /></button>
              </>
            )}
          </div>

          <div className="absolute bottom-6 flex gap-2 z-50">
            {selectedGallery.images.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlideIndex(idx)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'bg-[#ffb900] w-6' : 'bg-gray-600 hover:bg-gray-400'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}