'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import styles from './conversations.module.css';

type ConversationSource = 'MANUAL' | 'CAMPAIGN';

interface Conversation {
  id: string;
  lead: {
    id: string;
    phoneNumber: string;
    firstName: string | null;
    lastName: string | null;
  };
  lastMessageAt: string;
  source: ConversationSource;
  messages: {
    id: string;
    body: string;
    direction: string;
    createdAt: string;
  }[];
}

export default function ConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLastMessage = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return 'No messages';
    const last = conversation.messages[conversation.messages.length - 1];
    return last.body.length > 50 ? last.body.substring(0, 50) + '...' : last.body;
  };

  const getLastMessageTime = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return '';
    const last = conversation.messages[conversation.messages.length - 1];
    return new Date(last.createdAt).toLocaleString();
  };

  if (conversations.length === 0 && !loading) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="No conversations yet"
          description="Conversations will appear here when leads reply to your messages."
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Conversations</h2>
      </div>

      <div className={styles.conversationList}>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={styles.conversationItem}
            onClick={() => router.push(`/dashboard/conversations/${conversation.id}`)}
          >
            <div className={styles.avatar}>
              {conversation.lead.firstName?.[0] || conversation.lead.phoneNumber[0]}
            </div>
            <div className={styles.conversationContent}>
              <div className={styles.conversationHeader}>
                <span className={styles.contactName}>
                  {conversation.lead.firstName || conversation.lead.lastName
                    ? `${conversation.lead.firstName || ''} ${conversation.lead.lastName || ''}`.trim()
                    : conversation.lead.phoneNumber}
                </span>
                <span className={styles.time}>{getLastMessageTime(conversation)}</span>
              </div>
              <p className={styles.lastMessage}>{getLastMessage(conversation)}</p>
              <div className={styles.conversationMeta}>
                <Badge variant="info" size="sm">{conversation.source === 'MANUAL' ? 'Manual' : 'Campaign'}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
