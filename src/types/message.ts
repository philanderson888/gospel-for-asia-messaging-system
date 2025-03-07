export interface Message {
    id: string;
    sponsor_id: string;
    created_at: string;
    message_text: string;
    message_has_been_read: boolean;
    message_direction: 'to_child' | 'to_sponsor';
    image01_url?: string;
    image02_url?: string;
  }