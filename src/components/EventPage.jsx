import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Ticket, CheckCircle2, CreditCard, Mail, Phone, ShieldCheck, User, Fingerprint, BookOpen, Loader2, LogIn } from 'lucide-react';
import { db } from '../firebase'; 
import { ref, push, set, serverTimestamp } from 'firebase/database';

export default function EventPage({ event, onBack, currentUser, onOpenAuth }) {
  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    role: '',
    nic: '',
    admissionNo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');
  const [hasNoNic, setHasNoNic] = useState(false);

  const studentPrice = event.studentPrice || event.price || "Free";
  const normalPrice = event.normalPrice || event.price || "LKR 1,000.00";
  const ticketPrice = formData.role === 'Student' ? studentPrice : normalPrice;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2); 
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newTicketId = `MCG-26-${Math.floor(Math.random() * 9000) + 1000}`;
      setGeneratedTicket(newTicketId);

      const registrationsRef = ref(db, 'registrations');
      const newRegistrationRef = push(registrationsRef); 
      
      await set(newRegistrationRef, {
        eventId: event.id,
        eventTitle: event.title,
        userId: currentUser ? currentUser.uid : 'guest', 
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        nic: hasNoNic ? "N/A" : formData.nic,
        admissionNo: formData.admissionNo || "N/A",
        ticketId: newTicketId,
        paymentStatus: "Success (Dummy)",
        amountPaid: ticketPrice,
        timestamp: serverTimestamp() 
      });

      setStep(3); 
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Registration failed! Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#262523] text-white pt-6 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-[#ffb900] transition mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-[#3A3937] rounded-2xl overflow-hidden border border-gray-800 shadow-xl mb-8">
          <div className="h-64 sm:h-80 w-full relative">
            <img 
              src={event.coverImage} 
              alt={event.title} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3A3937] to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="px-3 py-1 bg-[#ffb900]/20 text-[#ffb900] border border-[#ffb900]/30 rounded-md text-sm font-bold tracking-wide uppercase">
                  {event.category}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-2 leading-tight">
                  {event.title}
                </h1>
              </div>
              
              <div className="hidden sm:block bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 px-6 py-3 rounded-xl font-bold text-xl shadow-lg transition-all">
                {ticketPrice}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-wrap gap-6 text-sm text-gray-300 border-t border-gray-700 bg-[#3A3937] relative">
            <div className="sm:hidden absolute top-4 right-6 bg-[#ffb900] text-slate-950 px-3 py-1 rounded-md font-bold text-sm">
              {ticketPrice}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#ffb900]" />
              <span className="text-base">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ffb900]" />
              <span className="text-base">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF9D09]" />
              <span className="text-base">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF9D09]" />
              <span className="text-base">{event.registeredCount} / {event.maxCapacity} Registered</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#3A3937] p-6 sm:p-8 rounded-xl border border-gray-800">
              <h3 className="text-2xl font-bold text-[#ffb900] mb-4">About the Event</h3>
              <p className="text-gray-300 leading-relaxed text-base">
                {event.description}
               </p>
            </div>
          </div>

          <div className="bg-[#3A3937] p-6 sm:p-8 rounded-xl border border-[#ffb900]/30 shadow-[0_0_20px_rgba(255,185,0,0.1)] h-fit">
  
            {!currentUser ? (
              <div className="text-center py-8 px-2">
                <div className="w-14 h-14 rounded-2xl bg-[#ffb900]/10 border border-[#ffb900]/30 flex items-center justify-center mx-auto mb-4 text-[#ffb900]">
                  <LogIn className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sign In Required</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  You must sign in or create an account to reserve gate passes and manage your tickets.
                </p>
                <button 
                  onClick={onOpenAuth}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition text-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In / Register Now
                </button>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <>
                    <div className="mb-6 border-b border-gray-700/50 pb-4">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                        <Ticket className="w-6 h-6 text-[#FF9D09]" />
                        Reserve Your Pass
                      </h3>
                      <p className="text-sm text-gray-400">Please fill in your details below. Logged in as <span className="text-[#ffb900] font-semibold">{currentUser.email}</span></p>
                    </div>
                    
                    <form onSubmit={handleDetailsSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#ffb900] transition text-sm" placeholder="Enter your full name" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#ffb900] transition text-sm" placeholder="your@email.com" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Phone No <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#ffb900] transition text-sm" placeholder="07X XXX XXXX" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Role <span className="text-red-500">*</span></label>
                          <select required name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-[#262523] border border-gray-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffb900] transition text-sm appearance-none">
                            <option value="" hidden>Select Role</option>
                            <option value="Student">Student</option>
                            <option value="Old Boy">Old Boy</option>
                            <option value="Parent">Parent</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Guest">Guest</option>
                          </select>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-gray-300">
                              NIC Number {!hasNoNic && <span className="text-red-500">*</span>}
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer hover:text-white transition">
                              <input 
                                type="checkbox" 
                                checked={hasNoNic}
                                onChange={(e) => {
                                  setHasNoNic(e.target.checked);
                                  if(e.target.checked) setFormData({...formData, nic: ''});
                                }}
                                className="accent-[#ffb900] w-3.5 h-3.5"
                              />
                              No NIC
                            </label>
                          </div>
                          <div className="relative">
                            <Fingerprint className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input required={!hasNoNic} disabled={hasNoNic} name="nic" value={formData.nic} onChange={handleInputChange} type="text" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#ffb900] transition text-sm disabled:opacity-40" placeholder={hasNoNic ? "Not Applicable" : "NIC / Passport"} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                          Admission Number <span className="text-gray-500 font-normal text-xs ml-1">(Optional)</span>
                        </label>
                        <div className="relative">
                          <BookOpen className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input name="admissionNo" value={formData.admissionNo} onChange={handleInputChange} type="text" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#ffb900] transition text-sm" placeholder="Mahinda College Admission No (If available)" />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit"
                          className="w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition active:scale-95 text-base"
                        >
                          <span>Proceed to Payment</span>
                          <span className="bg-slate-950/20 px-2.5 py-1 rounded-md text-sm font-black tracking-wide">{ticketPrice}</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-700/50 pb-4">
                      <button onClick={() => !isSubmitting && setStep(1)} className="text-gray-400 hover:text-[#ffb900] transition bg-[#262523] p-2 rounded-lg border border-gray-700">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-[#FF9D09]" /> Checkout
                      </h3>
                    </div>

                    <div className="bg-[#262523] p-5 rounded-xl border border-[#ffb900]/30 mb-6 flex justify-between items-center shadow-inner">
                      <span className="text-sm text-gray-400 font-medium">Total Payable:</span>
                      <span className="text-2xl font-black text-[#ffb900]">{ticketPrice}</span>
                    </div>
                    
                    <form onSubmit={handlePaymentSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Card Number</label>
                        <input required disabled={isSubmitting} type="text" maxLength="19" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffb900] tracking-widest font-mono text-sm disabled:opacity-50" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-1.5">Expiry Date</label>
                          <input required disabled={isSubmitting} type="text" maxLength="5" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffb900] text-center text-sm disabled:opacity-50" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-1.5">CVC / CVV</label>
                          <input required disabled={isSubmitting} type="password" maxLength="3" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffb900] text-center text-sm disabled:opacity-50" placeholder="***" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1.5">Name on Card</label>
                        <input required disabled={isSubmitting} type="text" className="w-full bg-[#262523] border border-gray-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffb900] text-sm uppercase disabled:opacity-50" placeholder="JOHN DOE" />
                      </div>

                      <div className="flex items-center gap-2 mt-4 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs text-emerald-400 font-medium">
                        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                        <p>This is a secure dummy payment gateway. No real funds will be deducted.</p>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition active:scale-95 text-base flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing...</span></>
                        ) : (
                          <span>Pay Now & Generate Pass</span>
                        )}
                      </button>
                    </form>
                  </>
                )}

                {step === 3 && (
                  <div className="text-center py-10 px-4">
                    <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-5 animate-bounce" />
                    <h3 className="text-3xl font-extrabold text-white mb-3">Payment Successful!</h3>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                      Your digital gate pass has been successfully generated. We have also sent a copy to your email address.
                    </p>
                    
                    <div className="bg-[#262523] p-6 rounded-2xl border-2 border-dashed border-[#ffb900]/50 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffb900]/10 rounded-bl-full"></div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Your Ticket ID</p>
                      <p className="text-3xl font-mono font-black text-[#ffb900] tracking-wider">{generatedTicket}</p>
                    </div>

                    <button 
                      onClick={onBack}
                      className="w-full py-4 bg-gradient-to-r from-[#ffb900] to-[#FF9D09] text-slate-950 font-bold rounded-xl transition shadow-[0_0_15px_rgba(255,185,0,0.4)]"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
          
        </div>
      </div>
    </div>
  );
}