import React from 'react';
import { ConversationUIProvider } from '../../../features/assistant/presentation/contexts/UIContexts';
import { AssistantHomeScreen } from '../../../features/assistant/presentation/screens/AssistantScreens';

export default function AssistantHomeRoute() {
  return (
    <ConversationUIProvider>
      <AssistantHomeScreen />
    </ConversationUIProvider>
  );
}
