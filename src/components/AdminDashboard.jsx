import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, push, set, update, remove, onValue, serverTimestamp } from 'firebase/database';
import { Shield, PlusCircle, LogOut, Loader2, CheckCircle2, Image as ImageIcon, Ticket, Users, DollarSign, Activity, Trophy, Zap, Send, Camera, Images, Radio, Edit, Trash2, X } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  
  const [scoreData, setScoreData] = useState({
    isLive: true,
    matchTitle: "121st Lovers' Quarrel - Big Match",
    status: "Live Now",
    battingTeam: "team1",
    team1Name: "Mahinda College",
    team1Score: "245/4",
    team1Details: "Overs: 45.2",
    team2Name: "Richmond College",
    team2Score: "112/2",
    team2Details: "Overs: 24.0",
    activePlayer1: "John Doe 42* (50)",
    activePlayer2: "Jane Doe 20* (32)",
    activeOpponent: "Kamal Perera 2/45 (8.2)",
    partnership: "Partnership: 64 runs off 52 balls",
    currentOverDetails: "1 0 4 W 1 2"
  });

  const [isUpdatingScore, setIsUpdatingScore] = useState(false);
  const [scoreSuccess, setScoreSuccess] = useState(false);


  const [announcementsList, setAnnouncementsList] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');
  const [isPostingAnn, setIsPostingAnn] = useState(false);
  const [annSuccess, setAnnSuccess] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);

 
  const [highlightsList, setHighlightsList] = useState([]);
  const [highlightData, setHighlightData] = useState({ title: '', coverImage: '', extraImages: '' });
  const [isPostingHighlight, setIsPostingHighlight] = useState(false);
  const [highlightSuccess, setHighlightSuccess] = useState(false);
  const [editingHighlightId, setEditingHighlightId] = useState(null);


  const [eventsList, setEventsList] = useState([]);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingEventId, setEditingEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: '', category: 'Sports', date: '', time: '', venue: '', studentPrice: 'Free', normalPrice: 'LKR 1,000.00', maxCapacity: '', description: '', coverImage: ''
  });

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    const regRef = ref(db, 'registrations');
    const scoreRef = ref(db, 'liveScore');
    const highlightsRef = ref(db, 'highlights');
    const annRef = ref(db, 'announcements');

    const unsubEvents = onValue(eventsRef, (snap) => {
      const data = snap.val();
      if (data) setEventsList(Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse());
      else setEventsList([]);
    });

    const unsubRegs = onValue(regRef, (snap) => {
      const data = snap.val();
      if (data) setRegistrationsList(Object.keys(data).map(k => ({ id: k, ...data[k] })));
      else setRegistrationsList([]);
      setIsLoadingData(false);
    });

    const unsubScore = onValue(scoreRef, (snap) => {
      const data = snap.val();
      if (data) setScoreData(data);
    });

    const unsubHighlights = onValue(highlightsRef, (snap) => {
      const data = snap.val();
      if (data) setHighlightsList(Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse());
      else setHighlightsList([]);
    });

    const unsubAnn = onValue(annRef, (snap) => {
      const data = snap.val();
      if (data) setAnnouncementsList(Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse());
      else setAnnouncementsList([]);
    });

    return () => { unsubEvents(); unsubRegs(); unsubScore(); unsubHighlights(); unsubAnn(); };
  }, []);

  const getEventStats = (eventId) => {
    const eventRegs = registrationsList.filter(r => r.eventId === eventId);
    const ticketsSold = eventRegs.length;
    let totalRevenue = 0;
    eventRegs.forEach(reg => {
      if (reg.amountPaid && reg.amountPaid.toLowerCase() !== 'free') {
        const val = parseFloat(reg.amountPaid.replace(/[^0-9.]/g, ''));
        if (!isNaN(val)) totalRevenue += val;
      }
    });
    return { ticketsSold, totalRevenue };
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleScoreChange = (e) => {
    const { name, value, type, checked } = e.target;
    setScoreData({ ...scoreData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUpdateScore = async (e) => {
    e.preventDefault();
    setIsUpdatingScore(true);
    try {
      const scoreRef = ref(db, 'liveScore');
      await set(scoreRef, scoreData);
      setScoreSuccess(true);
      setTimeout(() => setScoreSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update score.");
    } finally {
      setIsUpdatingScore(false);
    }
  };

  const handleEditAnnouncement = (ann) => {
    setEditingAnnouncementId(ann.id);
    setAnnouncementText(ann.text || '');
    setAnnouncementType(ann.type || 'info');
  };

  const cancelEditAnnouncement = () => {
    setEditingAnnouncementId(null);
    setAnnouncementText('');
    setAnnouncementType('info');
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try { await remove(ref(db, `announcements/${id}`)); } 
      catch (error) { alert("Failed to delete announcement."); }
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setIsPostingAnn(true);
    try {
      if (editingAnnouncementId) {
        await update(ref(db, `announcements/${editingAnnouncementId}`), { text: announcementText.trim(), type: announcementType });
      } else {
        await set(push(ref(db, 'announcements')), { text: announcementText.trim(), type: announcementType, time: "Just now", timestamp: serverTimestamp(), author: 'Admin' });
      }
      setAnnouncementText('');
      setEditingAnnouncementId(null);
      setAnnSuccess(true);
      setTimeout(() => setAnnSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save announcement.");
    } finally {
      setIsPostingAnn(false);
    }
  };

  const handleEditHighlight = (highlight) => {
    setEditingHighlightId(highlight.id);
    const extraUrls = highlight.images && highlight.images.length > 0 
      ? highlight.images.filter(img => img !== highlight.coverImage).join('\n') 
      : '';
    setHighlightData({ title: highlight.title || '', coverImage: highlight.coverImage || '', extraImages: extraUrls });
  };

  const cancelEditHighlight = () => {
    setEditingHighlightId(null);
    setHighlightData({ title: '', coverImage: '', extraImages: '' });
  };

  const handleDeleteHighlight = async (id) => {
    if (window.confirm("Are you sure you want to delete this highlight gallery?")) {
      try { await remove(ref(db, `highlights/${id}`)); } 
      catch (error) { alert("Failed to delete highlight."); }
    }
  };

  const handlePostHighlight = async (e) => {
    e.preventDefault();
    if (!highlightData.coverImage.trim() || !highlightData.title.trim()) return;
    setIsPostingHighlight(true);
    try {
      const extraUrls = highlightData.extraImages.split('\n').map(url => url.trim()).filter(url => url !== '');
      const allImages = [highlightData.coverImage.trim(), ...extraUrls];
      if (editingHighlightId) {
        await update(ref(db, `highlights/${editingHighlightId}`), { title: highlightData.title.trim(), coverImage: highlightData.coverImage.trim(), images: allImages });
      } else {
        await set(push(ref(db, 'highlights')), { title: highlightData.title.trim(), coverImage: highlightData.coverImage.trim(), images: allImages, timestamp: serverTimestamp() });
      }
      setHighlightData({ title: '', coverImage: '', extraImages: '' });
      setEditingHighlightId(null);
      setHighlightSuccess(true);
      setTimeout(() => setHighlightSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save highlight gallery.");
    } finally {
      setIsPostingHighlight(false);
    }
  };

  const handleEditEvent = (eventData) => {
    setEditingEventId(eventData.id);
    setFormData({
      title: eventData.title || '',
      category: eventData.category || 'Sports',
      date: eventData.date || '',
      time: eventData.time || '',
      venue: eventData.venue || '',
      studentPrice: eventData.studentPrice || 'Free',
      normalPrice: eventData.normalPrice || 'LKR 1,000.00',
      maxCapacity: eventData.maxCapacity || '',
      description: eventData.description || '',
      coverImage: eventData.coverImage || ''
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setFormData({ title: '', category: 'Sports', date: '', time: '', venue: '', studentPrice: 'Free', normalPrice: 'LKR 1,000.00', maxCapacity: '', description: '', coverImage: '' });
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this EVENT? This action cannot be undone and will permanently remove it from the site.")) {
      try {
        await remove(ref(db, `events/${id}`));
      } catch (error) {
        alert("Failed to delete event.");
      }
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingEventId) {
        await update(ref(db, `events/${editingEventId}`), { ...formData });
      } else {
        await set(push(ref(db, 'events')), { ...formData, registeredCount: 0, status: "Upcoming", createdAt: serverTimestamp() });
      }
      setSuccessMsg(true);
      cancelEditEvent();
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error) {
      alert("Failed to save event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#262523] text-white pt-6 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Admin Control Panel</h1>
              <p className="text-sm text-gray-400">Manage scores, announcements, events & ticket sales</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-[#3A3937] hover:bg-red-500/20 hover:text-red-400 text-gray-300 rounded-lg transition border border-gray-700 hover:border-red-500/50 text-sm font-bold">
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          <div className="lg:col-span-2 bg-[#3A3937] p-6 rounded-2xl border border-red-500/30 shadow-xl">
            <h2 className="text-lg font-bold text-red-400 flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5" /> Detailed Live Score Control
            </h2>
            {scoreSuccess && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">Scoreboard updated successfully!</div>}

            <form onSubmit={handleUpdateScore} className="space-y-4 text-sm">
              <div className="flex items-center justify-between bg-[#262523] p-4 rounded-xl border border-gray-700 shadow-inner">
                <div className="flex items-center gap-3">
                  <Radio className={`w-6 h-6 ${scoreData.isLive ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`} />
                  <div>
                    <p className="text-sm font-bold text-white">Live Scoreboard Visibility</p>
                    <p className="text-xs text-gray-400">Turn on to show the scoreboard on the Updates page</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isLive" checked={scoreData.isLive} onChange={handleScoreChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Match Title</label>
                  <input required name="matchTitle" value={scoreData.matchTitle} onChange={handleScoreChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-3 py-2 text-white" disabled={!scoreData.isLive} />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Status Badge</label>
                  <input required name="status" value={scoreData.status} onChange={handleScoreChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-3 py-2 text-white" placeholder="Live Now, Lunch..." disabled={!scoreData.isLive} />
                </div>
              </div>

              <div className={`transition-opacity ${!scoreData.isLive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="bg-[#262523] p-3 rounded-xl border border-[#ffb900]/40 flex items-center gap-4 mb-4">
                  <span className="text-xs font-bold text-[#ffb900] uppercase tracking-wide">Currently Batting:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="battingTeam" value="team1" checked={scoreData.battingTeam === 'team1'} onChange={handleScoreChange} className="accent-[#ffb900]" />
                    <span className="font-semibold">Team 1</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="battingTeam" value="team2" checked={scoreData.battingTeam === 'team2'} onChange={handleScoreChange} className="accent-[#ffb900]" />
                    <span className="font-semibold">Team 2</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-[#262523] rounded-xl border border-gray-700 mb-4">
                  <div className={scoreData.battingTeam === 'team1' ? 'ring-1 ring-[#ffb900] p-2 rounded-lg bg-[#3A3937]/50' : 'p-2'}>
                    <label className="block text-xs font-semibold text-[#ffb900] mb-1">Team 1 Details</label>
                    <input required name="team1Name" value={scoreData.team1Name} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white mb-2" placeholder="Team Name" />
                    <input required name="team1Score" value={scoreData.team1Score} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white mb-2 font-bold" placeholder="Main Score (245/4)" />
                    <input name="team1Details" value={scoreData.team1Details} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white text-xs" placeholder="Sub Info (Overs: 45.2)" />
                  </div>

                  <div className={scoreData.battingTeam === 'team2' ? 'ring-1 ring-[#ffb900] p-2 rounded-lg bg-[#3A3937]/50' : 'p-2'}>
                    <label className="block text-xs font-semibold text-[#ffb900] mb-1">Team 2 Details</label>
                    <input required name="team2Name" value={scoreData.team2Name} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white mb-2" placeholder="Team Name" />
                    <input required name="team2Score" value={scoreData.team2Score} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white mb-2 font-bold" placeholder="Main Score (Yet to bat)" />
                    <input name="team2Details" value={scoreData.team2Details} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white text-xs" placeholder="Sub Info (Overs: 0.0)" />
                  </div>
                </div>

                <div className="p-4 bg-[#262523] rounded-xl border border-gray-700">
                  <label className="block text-xs font-bold text-gray-300 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400"/> Current Action on Field</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input name="activePlayer1" value={scoreData.activePlayer1} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white text-xs" placeholder="Striker / Player 1" />
                    <input name="activePlayer2" value={scoreData.activePlayer2} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white text-xs" placeholder="Non-Striker / Player 2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input name="activeOpponent" value={scoreData.activeOpponent} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white text-xs" placeholder="Current Bowler / Opponent" />
                    <input name="currentOverDetails" value={scoreData.currentOverDetails} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-emerald-500/40 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-500" placeholder="This Over (e.g. 1 0 4 W 1 6)" />
                  </div>
                  <input name="partnership" value={scoreData.partnership} onChange={handleScoreChange} className="w-full bg-[#3A3937] border border-gray-600 rounded-lg px-3 py-2 text-white text-xs" placeholder="Partnership / Highlight Text" />
                </div>
              </div>

              <button type="submit" disabled={isUpdatingScore} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
                {isUpdatingScore ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Broadcast Live Score</span>}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            
            <div className="bg-[#3A3937] p-6 rounded-2xl border border-[#ffb900]/30 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#ffb900] flex items-center gap-2">
                  <Zap className="w-5 h-5" /> {editingAnnouncementId ? "Edit Announcement" : "Send Announcement"}
                </h2>
                {editingAnnouncementId && (
                  <button onClick={cancelEditAnnouncement} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                    <X className="w-3 h-3" /> Cancel
                  </button>
                )}
              </div>
              
              {annSuccess && <div className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-xl">Announcement saved successfully!</div>}
              
              <form onSubmit={handlePostAnnouncement} className="space-y-4 text-sm">
                <select value={announcementType} onChange={(e) => setAnnouncementType(e.target.value)} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-3 py-2.5 text-white">
                  <option value="info">General Info</option><option value="alert">Urgent Alert</option>
                </select>
                <textarea rows="3" required value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} placeholder="Type urgent announcement here..." className="w-full bg-[#262523] border border-gray-700 rounded-xl p-3 text-white resize-none"></textarea>
                <button type="submit" disabled={isPostingAnn} className={`w-full py-3 font-bold rounded-xl transition flex items-center justify-center gap-2 ${editingAnnouncementId ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950'}`}>
                  {isPostingAnn ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /><span>{editingAnnouncementId ? "Update" : "Broadcast"}</span></>}
                </button>
              </form>

              <div className="mt-8 border-t border-gray-700 pt-6">
                <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Manage Announcements</h3>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {announcementsList.length === 0 ? (
                    <p className="text-xs text-gray-500">No announcements posted yet.</p>
                  ) : (
                    announcementsList.map(ann => (
                      <div key={ann.id} className="flex items-center justify-between bg-[#262523] p-3 rounded-xl border border-gray-700 hover:border-gray-500 transition">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ann.type === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-[#ffb900]/20 text-[#ffb900]'}`}>
                            <Zap className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm text-gray-200 truncate">{ann.text}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleEditAnnouncement(ann)} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#3A3937] p-6 rounded-2xl border border-[#ffb900]/30 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#ffb900] flex items-center gap-2">
                  <Images className="w-5 h-5" /> {editingHighlightId ? "Edit Gallery" : "Add Highlight Gallery"}
                </h2>
                {editingHighlightId && (
                  <button onClick={cancelEditHighlight} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                    <X className="w-3 h-3" /> Cancel
                  </button>
                )}
              </div>
              
              {highlightSuccess && <div className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-xl">Gallery saved successfully!</div>}
              
              <form onSubmit={handlePostHighlight} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Gallery Title / Caption</label>
                  <input required value={highlightData.title} onChange={(e) => setHighlightData({...highlightData, title: e.target.value})} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-3 py-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Cover Image URL</label>
                  <input required value={highlightData.coverImage} onChange={(e) => setHighlightData({...highlightData, coverImage: e.target.value})} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-3 py-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Additional Photos (Optional)</label>
                  <textarea value={highlightData.extraImages} onChange={(e) => setHighlightData({...highlightData, extraImages: e.target.value})} rows="3" className="w-full bg-[#262523] border border-gray-700 rounded-xl p-3 text-white resize-y" placeholder="Paste extra image URLs here. (One URL per line)"></textarea>
                </div>
                <button type="submit" disabled={isPostingHighlight} className={`w-full py-3 font-bold rounded-xl transition flex items-center justify-center gap-2 ${editingHighlightId ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#262523] hover:bg-[#ffb900] hover:text-slate-950 text-[#ffb900] border border-[#ffb900]/50'}`}>
                  {isPostingHighlight ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ImageIcon className="w-4 h-4" /><span>{editingHighlightId ? "Update Gallery" : "Post Gallery"}</span></>}
                </button>
              </form>

              <div className="mt-8 border-t border-gray-700 pt-6">
                <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Manage Existing Highlights</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {highlightsList.length === 0 ? (
                    <p className="text-xs text-gray-500">No highlights added yet.</p>
                  ) : (
                    highlightsList.map(h => (
                      <div key={h.id} className="flex items-center justify-between bg-[#262523] p-3 rounded-xl border border-gray-700 hover:border-gray-500 transition">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={h.coverImage} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" alt="" />
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{h.title}</p>
                            <p className="text-[10px] text-gray-500">{h.images?.length || 1} Photos</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleEditHighlight(h)} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition"><Edit className="w-4 h-4"/></button>
                          <button onClick={() => handleDeleteHighlight(h.id)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#ffb900] flex items-center gap-2 mb-6"><Activity className="w-5 h-5" /> Live Event Sales & Registrations</h2>
          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[#3A3937]/50 rounded-2xl border border-gray-800">
              <Loader2 className="w-8 h-8 text-[#ffb900] animate-spin mb-3" /><p className="text-gray-400 text-sm">Fetching live data...</p>
            </div>
          ) : eventsList.map(event => {
            const stats = getEventStats(event.id);
            const capacityProgress = Math.min((stats.ticketsSold / (event.maxCapacity || 1)) * 100, 100);
            return (
              <div key={event.id} className="bg-[#3A3937] p-5 rounded-xl border border-gray-700 mb-4 shadow-sm relative group hover:border-[#ffb900]/50 transition">
                
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditEvent(event)} title="Edit Event" className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition">
                    <Edit className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleDeleteEvent(event.id)} title="Delete Event" className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>

                <div className="pr-20">
                  <h3 className="font-bold text-white text-lg mb-1 truncate">{event.title}</h3>
                  <p className="text-xs text-gray-400">{event.date} | {event.category}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-[#262523] p-3 rounded-lg border border-gray-800">
                    <div className="text-xs text-gray-500 mb-1">Tickets Sold</div>
                    <div className="text-lg font-black text-white">{stats.ticketsSold} <span className="text-xs font-normal">/ {event.maxCapacity}</span></div>
                    <div className="w-full bg-gray-800 rounded-full h-1 mt-2"><div className="bg-[#ffb900] h-1 rounded-full" style={{ width: `${capacityProgress}%` }}></div></div>
                  </div>
                  <div className="bg-[#262523] p-3 rounded-lg border border-gray-800">
                    <div className="text-xs text-emerald-500 mb-1">Total Revenue</div>
                    <div className="text-lg font-black text-emerald-400">LKR {stats.totalRevenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#3A3937] p-6 sm:p-8 rounded-2xl border border-[#ffb900]/30 shadow-[0_0_20px_rgba(255,185,0,0.05)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#ffb900] flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> {editingEventId ? "Edit Existing Event" : "Create New Event"}
            </h2>
            {editingEventId && (
              <button onClick={cancelEditEvent} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-[#262523] px-3 py-1.5 rounded-lg border border-gray-700 transition">
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
          </div>

          {successMsg && <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 rounded-xl font-semibold text-sm">Event successfully {editingEventId ? "updated" : "published"}!</div>}
          
          <form onSubmit={handleSaveEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Event Title *</label>
                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category *</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none">
                  <option>Sports</option><option>Academic</option><option>Cultural</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-xs font-semibold text-gray-300 mb-1.5">Date *</label><input required name="date" type="date" value={formData.date} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-300 mb-1.5">Time *</label><input required name="time" type="time" value={formData.time} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-300 mb-1.5">Venue *</label><input required name="venue" value={formData.venue} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-xs font-semibold text-gray-300 mb-1.5">Student Price *</label><input required name="studentPrice" value={formData.studentPrice} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-300 mb-1.5">Normal Price *</label><input required name="normalPrice" value={formData.normalPrice} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-300 mb-1.5">Max Capacity *</label><input required name="maxCapacity" type="number" value={formData.maxCapacity} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" /></div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Cover Image URL *</label>
              <input required name="coverImage" value={formData.coverImage} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#ffb900] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Event Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-[#262523] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:border-[#ffb900] focus:outline-none"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full py-4 font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${editingEventId ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 hover:brightness-110'}`}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingEventId ? "Save Changes" : "Publish Event"}</span>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}