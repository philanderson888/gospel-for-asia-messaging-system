import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Message } from '../types/message';
import { getMessagesBySponsorId, addMessage, markMessageAsRead } from '../services/sponsorMessageService';
import toast from 'react-hot-toast';

interface AuthenticatedUser {
  id: string;
  sponsor_id: string | null;
  is_sponsor: boolean;
  is_missionary: boolean;
  bridge_of_hope_id: string | null;
}

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const loadUserAndMessages = async () => {
      if (!user) return;

      try {
        // Get the user's details
        const { data: userData, error: userError } = await supabase
          .from('authenticated_users')
          .select('sponsor_id, is_sponsor, is_missionary, bridge_of_hope_id')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        setCurrentUser(userData);

        // Load appropriate messages based on user type
        if (userData.is_sponsor && userData.sponsor_id) {
          // Load sponsor messages
          const sponsorMessages = getMessagesBySponsorId(userData.sponsor_id);
          setMessages(sponsorMessages);

          // Mark unread messages as read
          sponsorMessages
            .filter(m => !m.message_has_been_read)
            .forEach(m => markMessageAsRead(m.id));
        }
        // Bridge of Hope messages will be handled separately

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
    if (!currentUser?.sponsor_id) {
      toast.error('Sponsor ID not found');
      return;
    }

    if (newMessage.length === 0) {
      toast.error('Please enter a message');
      return;
    }

    if (newMessage.length > 200) {
      toast.error('Message cannot exceed 200 characters');
      return;
    }

    try {
      const message = addMessage({
        sponsor_id: currentUser.sponsor_id,
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

  // Show sponsor message interface
  if (currentUser?.is_sponsor) {
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
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  New Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    rows={4}
                    maxLength={200}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                    placeholder="Type your message here (maximum 200 characters)"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <div className="mt-4 mb-4 flex items-center justify-between">
                    <span className={`text-sm ${newMessage.length > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                      {newMessage.length}/200 characters
                    </span>
                    <button
                      onClick={handleSendMessage}
                      disabled={newMessage.length === 0 || newMessage.length > 200}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        newMessage.length === 0 || newMessage.length > 200
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="space-y-6 border-t pt-6">
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

  // Show Bridge of Hope message interface (placeholder for now)
  if (currentUser?.is_missionary) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0 mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Bridge of Hope Messages</h2>
              <p className="text-gray-600">
                Message management interface for Bridge of Hope centers coming soon.
                Check the console for message data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}