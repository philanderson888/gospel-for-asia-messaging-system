import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Message } from '../types/message';
import { getMessagesBySponsorId, addMessage, markMessageAsRead } from '../services/messageService';
import toast from 'react-hot-toast';

interface AuthenticatedUser {
  id: string;
  sponsor_id: string | null;
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sponsorId, setSponsorId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAndMessages = async () => {
      if (!user) return;

      try {
        // Get the user's sponsor ID
        const { data: userData, error: userError } = await supabase
          .from('authenticated_users')
          .select('sponsor_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        if (!userData.sponsor_id) {
          toast.error('Sponsor ID not found');
          return;
        }

        setSponsorId(userData.sponsor_id);

        // Load messages
        const sponsorMessages = getMessagesBySponsorId(userData.sponsor_id);
        setMessages(sponsorMessages);

        // Mark unread messages as read
        sponsorMessages
          .filter(m => !m.message_has_been_read)
          .forEach(m => markMessageAsRead(m.id));

      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadUserAndMessages();
  }, [user]);

  const handleSendMessage = () => {
    if (!sponsorId) {
      toast.error('Sponsor ID not found');
      return;
    }

    if (newMessage.length < 200) {
      toast.error('Message must be at least 200 characters');
      return;
    }

    try {
      const message = addMessage({
        sponsor_id: sponsorId,
        message_text: newMessage,
        message_has_been_read: false,
        message_direction: 'to_child'
      });

      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-6">Messages</h2>

            {/* New Message Form */}
            <div className="mb-12 relative pb-12 border-b border-gray-200">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                New Message
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-10"
                  placeholder="Type your message here (minimum 200 characters)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="absolute bottom-0 right-0 flex items-center space-x-4 bg-white px-3 py-2">
                  <span className={`text-sm ${newMessage.length < 200 ? 'text-red-500' : 'text-green-500'}`}>
                    {newMessage.length}/200
                  </span>
                  <button
                    onClick={handleSendMessage}
                    disabled={newMessage.length < 200}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      newMessage.length < 200
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Message List */}
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.message_direction === 'to_child' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-3 max-w-lg ${
                      message.message_direction === 'to_child'
                        ? 'bg-indigo-50 text-indigo-900'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="text-sm mb-1">
                      {message.message_direction === 'to_child' ? 'You' : 'Child'}
                    </div>
                    <div className="text-sm">{message.message_text}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center text-gray-500">
                  No messages yet. Start the conversation by sending a message.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}