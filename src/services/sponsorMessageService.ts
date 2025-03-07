import { Message } from '../types/message';

const STORAGE_KEY = 'sponsor_messages';

// Initialize with sample messages if storage is empty
const initializeMessages = () => {
  const existingMessages = localStorage.getItem(STORAGE_KEY);
  if (!existingMessages) {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const sampleMessages: Message[] = [
      {
        id: '1',
        sponsor_id: '12345678',
        created_at: threeDaysAgo.toISOString(),
        message_text: 'Dear child, I hope this message finds you well. I am writing to let you know that I pray for you every day and I am so grateful to be your sponsor. I would love to hear about your studies and what you enjoy doing at the Bridge of Hope center.',
        message_has_been_read: true,
        message_direction: 'to_child'
      },
      {
        id: '2',
        sponsor_id: '12345678',
        created_at: twoDaysAgo.toISOString(),
        message_text: 'Dear sponsor, thank you for your kind message. I am doing well in my studies and I especially enjoy learning mathematics. At the Bridge of Hope center, I love playing cricket with my friends during break time. Thank you for your prayers.',
        message_has_been_read: true,
        message_direction: 'to_sponsor'
      },
      {
        id: '3',
        sponsor_id: '12345678',
        created_at: yesterday.toISOString(),
        message_text: 'I am so happy to hear that you enjoy mathematics! That was my favorite subject in school too. I will continue to pray for your studies and that God will bless you with wisdom and understanding. Keep working hard!',
        message_has_been_read: false,
        message_direction: 'to_child'
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleMessages));
    return sampleMessages;
  }

  return JSON.parse(existingMessages);
};

// Get all messages for a sponsor
export const getMessagesBySponsorId = (sponsorId: string): Message[] => {
  const messages = initializeMessages();
  return messages.filter(message => message.sponsor_id === sponsorId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Get unread messages count for a sponsor
export const getUnreadMessagesCount = (sponsorId: string): number => {
  const messages = initializeMessages();
  return messages.filter(message => 
    message.sponsor_id === sponsorId && 
    message.message_direction === 'to_sponsor' && 
    !message.message_has_been_read
  ).length;
};

// Add a new message
export const addMessage = (message: Omit<Message, 'id' | 'created_at'>): Message => {
  const messages = initializeMessages();
  const newMessage: Message = {
    ...message,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };

  messages.push(newMessage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  return newMessage;
};

// Mark a message as read
export const markMessageAsRead = (messageId: string): void => {
  const messages = initializeMessages();
  const updatedMessages = messages.map(message => 
    message.id === messageId 
      ? { ...message, message_has_been_read: true }
      : message
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
};

// Log all messages to console
export const logMessages = () => {
  const messages = initializeMessages();
  console.log('\n=== Sponsor Messages in Local Storage ===');
  messages.forEach(message => {
    console.log(`\nMessage ID: ${message.id}`);
    console.log(`From: ${message.message_direction === 'to_child' ? 'Sponsor' : 'Child'}`);
    console.log(`Sponsor ID: ${message.sponsor_id}`);
    console.log(`Date: ${new Date(message.created_at).toLocaleString()}`);
    console.log(`Read: ${message.message_has_been_read ? 'Yes' : 'No'}`);
    console.log(`Text: ${message.message_text}`);
  });
  console.log('\n');
};