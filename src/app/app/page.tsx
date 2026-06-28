import { ChatPageClient } from '@/components/app/chat-page-client';
import { getConversationDetail } from '@/lib/conversations';
import { getCurrentSession } from '@/lib/session';

export default async function AppHomePage({
  searchParams
}: {
  searchParams?: Promise<{ conversationId?: string; prompt?: string; country?: string }>;
}) {
  const session = await getCurrentSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const conversationId = resolvedSearchParams?.conversationId;

  const conversation = conversationId
    ? await getConversationDetail(
        {
          scopeType: session.type,
          scopeId: session.id,
          userId: session.type === 'user' ? session.id : undefined
        },
        conversationId
      )
    : null;

  return (
    <ChatPageClient
      initialMessages={conversation?.messages ?? []}
      initialCitations={conversation?.citations ?? []}
      conversationId={conversation?.id}
      conversationTitle={conversation?.title}
      sessionLabel={session.type === 'user' ? 'Account session active' : 'Guest session active'}
      initialPrompt={conversation ? undefined : resolvedSearchParams?.prompt}
      initialCountry={resolvedSearchParams?.country}
    />
  );
}
