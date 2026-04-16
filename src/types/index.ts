export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'REPLIED' | 'INTERESTED' | 'NOT_INTERESTED' | 'CONVERTED' | 'BOUNCED' | 'UNSUBSCRIBED';

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export type MessageStatus = 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED' | 'DELIVERED' | 'READ' | 'REPLIED' | 'UNSUBSCRIBED' | 'CONVERTED' | 'BOUNCED';

export type MessageDirection = 'OUTBOUND' | 'INBOUND';

export type EventType = 'CAMPAIGN_CREATED' | 'CAMPAIGN_STARTED' | 'CAMPAIGN_PAUSED' | 'CAMPAIGN_COMPLETED' | 'LEAD_IMPORTED' | 'LEAD_UPDATED' | 'LEAD_UNSUBSCRIBED' | 'TEMPLATE_CREATED' | 'TEMPLATE_UPDATED' | 'MESSAGE_QUEUED' | 'MESSAGE_SENT' | 'MESSAGE_FAILED' | 'MESSAGE_DELIVERED' | 'MESSAGE_READ' | 'REPLY_RECEIVED' | 'CONVERSION_RECORDED';

export type ConversationSource = 'CAMPAIGN' | 'MANUAL' | 'WEBHOOK';

export interface User {
  id: string;
  companyName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  companyName: string;
  role: string;
}

export interface Lead {
  id: string;
  userId: string;
  whatsappAccountId: string | null;
  phoneNumber: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  source: string | null;
  customFieldsJson: string | null;
  optIn: boolean;
  unsubscribed: boolean;
  unsubscribedAt: Date | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  body: string;
  placeholderSchemaJson: string | null;
  previewExampleJson: string | null;
  isArchived: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  userId: string;
  whatsappAccountId: string;
  templateId: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  scheduledAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  batchSize: number;
  delayInSeconds: number;
  totalRecipients: number;
  totalQueued: number;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalReplied: number;
  totalConverted: number;
  totalFailed: number;
  totalUnsubscribed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  whatsappAccountId: string;
  campaignId: string | null;
  leadId: string;
  campaignLeadId: string | null;
  direction: MessageDirection;
  status: MessageStatus;
  whatsappMessageId: string | null;
  templateSnapshot: string | null;
  renderedBody: string | null;
  failureReason: string | null;
  queuedAt: Date | null;
  sendingAt: Date | null;
  sentAt: Date | null;
  deliveredAt: Date | null;
  readAt: Date | null;
  repliedAt: Date | null;
  bouncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppAccount {
  id: string;
  userId: string;
  accountName: string;
  phoneNumberId: string;
  businessAccountId: string;
  displayPhoneNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
