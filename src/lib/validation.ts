import { z } from 'zod';

export const signupSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const leadSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  source: z.string().optional(),
  customFieldsJson: z.string().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'REPLIED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'BOUNCED', 'UNSUBSCRIBED']).optional(),
  notes: z.string().optional(),
});

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  body: z.string().min(1, 'Template body is required'),
  placeholderSchemaJson: z.string().optional(),
  previewExampleJson: z.string().optional(),
});

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  templateId: z.string().uuid('Invalid template ID'),
  whatsappAccountId: z.string().uuid('Invalid WhatsApp account ID'),
  batchSize: z.number().int().min(1).max(100).default(10),
  delayInSeconds: z.number().int().min(1).max(300).default(5),
  scheduledAt: z.string().datetime().optional(),
});

export const whatsappAccountSchema = z.object({
  accountName: z.string().min(1, 'Account name is required'),
  phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
  businessAccountId: z.string().min(1, 'Business Account ID is required'),
  accessToken: z.string().min(1, 'Access token is required'),
  displayPhoneNumber: z.string().optional(),
  webhookVerifyToken: z.string().optional(),
});

export function validateTemplatePlaceholders(body: string): string[] {
  const placeholderRegex = /\{\{(\w+)\}\}/g;
  const placeholders: string[] = [];
  let match;
  
  while ((match = placeholderRegex.exec(body)) !== null) {
    placeholders.push(match[1]);
  }
  
  return [...new Set(placeholders)];
}

export function validateCampaignRecipients(recipientCount: number): { valid: boolean; message?: string } {
  if (recipientCount === 0) {
    return { valid: false, message: 'Campaign must have at least one recipient' };
  }
  
  if (recipientCount > 10000) {
    return { valid: false, message: 'Campaign cannot exceed 10,000 recipients at once' };
  }
  
  return { valid: true };
}
