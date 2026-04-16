const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

interface SendMessageParams {
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string;
  message: string;
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{ wa_id: string }>;
  messages: Array<{ id: string }>;
}

export async function sendWhatsAppMessage({
  phoneNumberId,
  accessToken,
  recipientPhone,
  message,
}: SendMessageParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API error:', errorData);
      return { success: false, error: errorData.error?.message || 'Failed to send message' };
    }

    const data: WhatsAppResponse = await response.json();
    return { success: true, messageId: data.messages[0]?.id };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: 'Network error' };
  }
}

export function renderTemplate(templateBody: string, placeholders: Record<string, string>): string {
  let rendered = templateBody;
  
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
    rendered = rendered.replace(regex, value);
  }
  
  rendered = rendered.replace(/\{\{[^}]+\}\}/g, '');
  
  return rendered;
}

export function extractPlaceholders(templateBody: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const placeholders: string[] = [];
  let match;

  while ((match = regex.exec(templateBody)) !== null) {
    placeholders.push(match[1]);
  }

  return [...new Set(placeholders)];
}

export async function getAccountInfo(phoneNumberId: string, accessToken: string) {
  try {
    const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}
