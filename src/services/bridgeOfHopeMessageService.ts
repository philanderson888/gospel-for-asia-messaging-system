import { Message } from '../types/message';

const STORAGE_KEY = 'bridge_of_hope_messages';

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
        sponsor_id: '87654321',
        created_at: threeDaysAgo.toISOString(),
        message_text: 'Dear child, I am praying for your studies and your family. May God bless you with wisdom and understanding. Here is a picture of our church.',
        message_has_been_read: true,
        message_direction: 'to_child',
        image01_url: 'https://picsum.photos/800/600?random=5'
      },
      {
        id: '2',
        sponsor_id: '87654321',
        created_at: twoDaysAgo.toISOString(),
        message_text: 'Thank you for your prayers! I am working hard in my studies and learning new things every day. Here is a picture from our school celebration.',
        message_has_been_read: true,
        message_direction: 'to_sponsor',
        image01_url: 'https://picsum.photos/800/600?random=6',
        image02_url: 'https://picsum.photos/800/600?random=7'
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleMessages));
    return sampleMessages;
  }

  return JSON.parse(existingMessages);
};

// Get messages for a Bridge of Hope center within the last 60 days
export const getRecentMessagesByCenter = (bridgeOfHopeId: string): Message[] => {
  const messages = initializeMessages();
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return messages.filter(message => {
    const messageDate = new Date(message.created_at);
    return messageDate >= sixtyDaysAgo;
  });
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

// Log recent messages for a Bridge of Hope center
export const logRecentMessagesForCenter = (bridgeOfHopeId: string) => {
  const messages = getRecentMessagesByCenter(bridgeOfHopeId);
  console.log(`\n=== Recent Messages (Last 60 Days) for Bridge of Hope Center ${bridgeOfHopeId} ===`);
  
  if (messages.length === 0) {
    console.log('No messages found in the last 60 days');
  } else {
    messages.forEach(message => {
      console.log(`\nMessage ID: ${message.id}`);
      console.log(`Direction: ${message.message_direction}`);
      console.log(`Sponsor ID: ${message.sponsor_id}`);
      console.log(`Date: ${new Date(message.created_at).toLocaleString()}`);
      console.log(`Read: ${message.message_has_been_read ? 'Yes' : 'No'}`);
      console.log(`Text: ${message.message_text}`);
      if (message.image01_url) {
        console.log(`Image 1: ${message.image01_url}`);
      }
      if (message.image02_url) {
        console.log(`Image 2: ${message.image02_url}`);
      }
    });
  }
  console.log('\n');
};