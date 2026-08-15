import React, { useEffect, useState, useRef } from 'react';
import { chatService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MessageSquare, Send, RefreshCw, AlertCircle, Calendar, User } from 'lucide-react';

export const CustomerChat = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchBookings =
      user?.role === 'Provider'
        ? bookingService.getProviderBookings()
        : bookingService.getCustomerBookings();

    fetchBookings
      .then((res) => {
        // Exclude cancelled/rejected/pending bookings for chat list
        const active = res.data.filter(
          (b) => b.status !== 'Cancelled' && b.status !== 'Rejected' && b.status !== 'Pending'
        );
        setBookings(active);

        // Check for specific bookingId query param to auto-select chat
        const queryParams = new URLSearchParams(window.location.search);
        const urlBookingId = parseInt(queryParams.get('bookingId'));
        if (urlBookingId) {
          const selected = res.data.find(b => b.bookingId === urlBookingId);
          if (selected) {
            handleSelectBooking(selected);
            return;
          }
        }

        if (active.length > 0) {
          // Auto select first booking chat
          handleSelectBooking(active[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setChatLoading(true);
    chatService.getChatMessages(booking.bookingId)
      .then((res) => {
        setMessages(res.data);
        scrollToBottom();
      })
      .catch((err) => console.error(err))
      .finally(() => setChatLoading(false));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedBooking) return;

    const isProvider = user?.role === 'Provider';
    const receiverId = isProvider ? selectedBooking.customerId : selectedBooking.providerUserId;

    const data = {
      bookingId: selectedBooking.bookingId,
      receiverId: receiverId,
      messageText: messageText,
    };

    chatService.sendMessage(data)
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
        setMessageText('');
        scrollToBottom();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to send message.');
      });
  };

  const refreshMessages = () => {
    if (!selectedBooking) return;
    setChatLoading(true);
    chatService.getChatMessages(selectedBooking.bookingId)
      .then((res) => {
        setMessages(res.data);
        scrollToBottom();
      })
      .catch((err) => console.error(err))
      .finally(() => setChatLoading(false));
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Customer Chat</h1>
        <p className="text-xs text-slate-500 mt-1">Communicate with customers directly regarding active and scheduled bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        {/* Conversations List sidebar */}
        <div className="sc-card md:col-span-1 overflow-y-auto divide-y divide-slate-100 flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500">
            Active Bookings ({bookings.length})
          </div>
          {bookings.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No conversations found.
            </div>
          ) : (
            bookings.map((b) => (
              <button
                key={b.bookingId}
                onClick={() => handleSelectBooking(b)}
                className={`p-3 w-full text-left text-xs transition-colors flex flex-col gap-1 ${
                  selectedBooking?.bookingId === b.bookingId
                    ? 'bg-indigo-50/50 border-r-4 border-indigo-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-slate-800">
                    {user?.role === 'Provider' ? b.customerName : (b.businessName || b.providerName)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Booking #{b.bookingId}</span>
                </div>
                <p className="text-slate-500 truncate w-full">{b.serviceTitle}</p>
              </button>
            ))
          )}
        </div>

        {/* Chat Window Panel */}
        <div className="sc-card md:col-span-2 flex flex-col h-full border border-slate-200 shadow-sm overflow-hidden">
          {selectedBooking ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {(user?.role === 'Provider' ? selectedBooking.customerName : (selectedBooking.businessName || selectedBooking.providerName)).substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {user?.role === 'Provider' ? selectedBooking.customerName : (selectedBooking.businessName || selectedBooking.providerName)}
                    </h3>
                    <p className="text-[10px] text-slate-400">{selectedBooking.serviceTitle}</p>
                  </div>
                </div>

                <button
                  onClick={refreshMessages}
                  disabled={chatLoading}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Refresh Chat"
                >
                  <RefreshCw className={`w-4 h-4 ${chatLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Chat Warnings (Disclaimer) */}
              <div className="px-4 py-2 bg-amber-50 text-amber-800 text-[10px] flex items-center gap-1 border-b border-amber-100">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>Basic database messaging. Click the refresh icon to poll for new replies.</span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {chatLoading && messages.length === 0 ? (
                  <LoadingSpinner />
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-8">
                    Send a message to start conversation regarding Booking #{selectedBooking.bookingId}.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === user.userId;
                    return (
                      <div
                        key={m.chatMessageId}
                        className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                        }`}>
                          {m.messageText}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">
                          {new Date(m.sentAt).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Footer */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="btn-primary p-2 rounded-lg"
                  title="Send Message"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-6 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <p>Select a customer booking on the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
