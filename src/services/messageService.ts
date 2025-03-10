import { Message } from '../types/message';

const STORAGE_KEY = 'messages';

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
      // Messages for first child (sponsor_id: 12345678)
      {
        id: '1',
        sponsor_id: '12345678',
        created_at: threeDaysAgo.toISOString(),
        message_text: 'Dear child, I hope this message finds you well. I am writing to let you know that I pray for you every day. Here is a picture of the beautiful mountains near my home.',
        message_has_been_read: true,
        message_direction: 'to_child',
        image01_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'
      },
      {
        id: '2',
        sponsor_id: '12345678',
        created_at: twoDaysAgo.toISOString(),
        message_text: 'Thank you for your kind message. I am doing well in my studies and I especially enjoy learning mathematics. Here is a picture from our school celebration.',
        message_has_been_read: true,
        message_direction: 'to_sponsor',
        image01_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754'
      },
      // Messages for second child (sponsor_id: 23456789)
      {
        id: '3',
        sponsor_id: '23456789',
        created_at: threeDaysAgo.toISOString(),
        message_text: 'Hello! I am so happy to be your sponsor. I pray for you and your family every day. Here are some pictures from our garden.',
        message_has_been_read: true,
        message_direction: 'to_child',
        image01_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
        image02_url: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b'
      },
      {
        id: '4',
        sponsor_id: '23456789',
        created_at: yesterday.toISOString(),
        message_text: 'Dear sponsor, thank you for your message and beautiful garden pictures! I love learning about plants in science class. Here is a picture of my science project.',
        message_has_been_read: false,
        message_direction: 'to_sponsor',
        image01_url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178'
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
  return messages
    .filter(message => message.sponsor_id === sponsorId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Get messages for a Bridge of Hope center within the last 60 days
export const getRecentMessagesByCenter = (bridgeOfHopeId: string): Message[] => {
  const messages = initializeMessages();
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return messages
    .filter(message => {
      const messageDate = new Date(message.created_at);
      return messageDate >= sixtyDaysAgo;
    })
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

// Reset all messages (for admin use)
export const resetMessages = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  initializeMessages();
};

// Log all messages
export const logMessages = () => {
  const messages = initializeMessages();
  console.log('\n=== Messages in Local Storage ===');
  messages.forEach(message => {
    console.log('\nMessage Details:');
    console.log('- ID:', message.id);
    console.log('- Direction:', message.message_direction);
    console.log('- Sponsor ID:', message.sponsor_id);
    console.log('- Date:', new Date(message.created_at).toLocaleString());
    console.log('- Read:', message.message_has_been_read ? 'Yes' : 'No');
    console.log('- Text:', message.message_text);
    if (message.image01_url) {
      console.log('- Image 1:', message.image01_url);
    }
    if (message.image02_url) {
      console.log('- Image 2:', message.image02_url);
    }
  });
  console.log('\nTotal messages:', messages.length);
  console.log('==================\n');
};

// Log recent messages for a Bridge of Hope center
export const logRecentMessagesForCenter = (bridgeOfHopeId: string) => {
  const messages = getRecentMessagesByCenter(bridgeOfHopeId);
  console.log(`\n=== Recent Messages (Last 60 Days) for Bridge of Hope Center ${bridgeOfHopeId} ===`);
  
  if (messages.length === 0) {
    console.log('No messages found in the last 60 days');
  } else {
    messages.forEach(message => {
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
  }
  console.log('\nTotal messages:', messages.length);
  console.log('==================\n');
};