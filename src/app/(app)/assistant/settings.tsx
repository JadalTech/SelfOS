import React from 'react';
import { ConversationUIProvider } from '../../../features/assistant/presentation/contexts/UIContexts';
import { AssistantSettingsScreen } from '../../../features/assistant/presentation/screens/AssistantScreens';

export default function AssistantSettingsRoute() {
  return (
    <ConversationUIProvider>
      <AssistantSettingsScreen />
    </ConversationUIProvider>
  );
}
