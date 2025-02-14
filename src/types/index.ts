export interface Webhook {
  id: string;
  name: string;
  url: string;
  imageUrl?: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url?: string;
  tags: string[];
  fileUrl?: string;
  createdAt: string;
  webhookId: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

export interface ScheduledMessage {
  id: string;
  content: string;
  webhookId: string;
  scheduledFor: string;
  type: 'message' | 'resource';
  resourceData?: Omit<Resource, 'id' | 'createdAt' | 'webhookId'>;
}