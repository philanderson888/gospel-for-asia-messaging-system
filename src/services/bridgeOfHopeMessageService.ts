import { Message } from '../types/message';
import { getMessagesBySponsorId, addMessage, markMessageAsRead, logMessages } from './messageService';

// Re-export functions from messageService
export { getMessagesBySponsorId, addMessage, markMessageAsRead, logMessages };

// Get messages for a Bridge of Hope center within the last 60 days
export const getRecentMessagesByCenter = (bridgeOfHopeId: string): Message[] => {
  const messages = getMessagesBySponsorId(bridgeOfHopeId);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return messages.filter(message => {
    const messageDate = new Date(message.created_at);
    return messageDate >= sixtyDaysAgo;
  });
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