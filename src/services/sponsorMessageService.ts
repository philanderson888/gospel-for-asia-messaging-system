import { Message } from '../types/message';
import { getMessagesBySponsorId, addMessage, markMessageAsRead, logMessages } from './messageService';

// Re-export functions from messageService
export { getMessagesBySponsorId, addMessage, markMessageAsRead, logMessages };