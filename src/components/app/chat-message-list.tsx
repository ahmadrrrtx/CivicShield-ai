import type { ChatMessageRecord } from '@/components/app/chat-demo-data';
import { ChatMessage } from '@/components/app/chat-message';

export function ChatMessageList({
  messages,
  conversationId,
  onRetry,
  retryDisabled
}: {
  messages: ChatMessageRecord[];
  conversationId?: string;
  onRetry?: () => void;
  retryDisabled?: boolean;
}) {
  return (
    <div className="space-y-4" aria-live="polite" aria-label="Conversation transcript">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          conversationId={conversationId}
          onRetry={message.role === 'assistant' ? onRetry : undefined}
          retryDisabled={retryDisabled}
        />
      ))}
    </div>
  );
}
