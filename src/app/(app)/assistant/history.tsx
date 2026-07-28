import React from 'react';
import { ConversationUIProvider } from '../../../features/assistant/presentation/contexts/UIContexts';
import { ConversationHistoryScreen } from '../../../features/assistant/presentation/screens/AssistantScreens';

export default function AssistantHistoryRoute() {
  return (
    <ConversationUIProvider>
      <ConversationHistoryScreen />
    </ConversationUIProvider>
  );
}
