import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Message } from '../types/message';
import { getMessagesBySponsorId, addMessage, markMessageAsRead, logMessages } from '../services/sponsorMessageService';
import { getChildBySponsorId } from '../services/childService';
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
  const { sponsorId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [childName, setChildName] = useState<string>('');

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

        // Load messages based on context
        const targetSponsorId = sponsorId || userData.sponsor_id;
        if (targetSponsorId) {
          // Load messages
          const sponsorMessages = getMessagesBySponsorId(targetSponsorId);
          setMessages(sponsorMessages);

          // Log messages for this sponsor
          console.log('\n=== Messages for Sponsor ID:', targetSponsorId, '===');
          sponsorMessages.forEach(message => {
            console.log('\nMessage Details:');
            console.log('- Direction:', message.message_direction);
            console.log('- Date:', new Date(message.created_at).toLocaleString());
            console.log('- Text:', message.message_text);
            console.log('- Read:', message.message_has_been_read ? 'Yes' : 'No');
            if (message.image01_url) {
              console.log('- Image 1:', message.image01_url);
            }
            if (message.image02_url) {
              console.log('- Image 2:', message.image02_url);
            }
          });
          console.log('\nTotal messages:', sponsorMessages.length);
          console.log('==================\n');

          // Get child's name if viewing as missionary
          if (userData.is_missionary) {
            const child = getChildBySponsorId(targetSponsorId);
            if (child) {
              setChildName(child.name);
            }
          }

          // Mark unread messages as read if viewing own messages
          if (!sponsorId) {
            sponsorMessages
              .filter(m => !m.message_has_been_read)
              .forEach(m => markMessageAsRead(m.id));
          }
        }

      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadUserAndMessages();
  }, [user, sponsorId]);

  const handleSendMessage = () => {
    const targetSponsorId = sponsorId || currentUser?.sponsor_id;
    if (!targetSponsorId) {
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
        sponsor_id: targetSponsorId,
        message_text: newMessage,
        message_has_been_read: false,
        message_direction: currentUser?.is_missionary ? 'to_sponsor' : 'to_child'
      });

      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      toast.success('Message sent successfully');

      // Log the new message
      console.log('\n=== New Message Sent ===');
      console.log('- Direction:', message.message_direction);
      console.log('- Date:', new Date(message.created_at).toLocaleString());
      console.log('- Text:', message.message_text);
      console.log('==================\n');
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
            to={currentUser?.is_missionary ? "/missionary-dashboard" : "/"}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {currentUser?.is_missionary ? "Missionary Dashboard" : "Dashboard"}
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-2">
              {currentUser?.is_missionary 
                ? `Messages with ${childName}'s Sponsor`
                : "Messages with Your Sponsored Child"}
            </h2>
            <p className="text-gray-600 mb-6">
              {currentUser?.is_missionary
                ? "View and respond to messages between the sponsor and child"
                : "Your messages of encouragement and support make a real difference in your sponsored child's life."}
            </p>

            {/* New Message Form */}
            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Write a New Message
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  rows={4}
                  maxLength={200}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                  placeholder={currentUser?.is_missionary
                    ? "Write a message on behalf of the child..."
                    : "Share your thoughts and prayers with your sponsored child..."}
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
                      {currentUser?.is_missionary
                        ? message.message_direction === 'to_child' ? 'Sponsor' : childName
                        : message.message_direction === 'to_child' ? 'You' : 'Your Sponsored Child'}
                    </div>
                    <div className="text-sm">{message.message_text}</div>
                    {(message.image01_url || message.image02_url) && (
                      <div className="mt-2 flex gap-2">
                        {message.image01_url && (
                          <img
                            src={message.image01_url}
                            alt="Message attachment 1"
                            className="rounded-md max-w-[200px] h-auto"
                          />
                        )}
                        {message.image02_url && (
                          <img
                            src={message.image02_url}
                            alt="Message attachment 2"
                            className="rounded-md max-w-[200px] h-auto"
                          />
                        )}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center text-gray-500">
                  <p className="mb-2">No messages yet.</p>
                  <p>
                    {currentUser?.is_missionary
                      ? "Start the conversation by sending a message on behalf of the child."
                      : "Start the conversation by sending an encouraging message to your sponsored child!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}