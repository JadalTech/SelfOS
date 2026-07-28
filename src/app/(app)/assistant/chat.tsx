import React from 'react';
import { ConversationUIProvider } from '../../../features/assistant/presentation/contexts/UIContexts';
import { ConversationScreen } from '../../../features/assistant/presentation/screens/AssistantScreens';

export default function AssistantChatRoute() {
  return (
    <ConversationUIProvider>
      <ConversationScreen />
    </ConversationUIProvider>
  );
}
