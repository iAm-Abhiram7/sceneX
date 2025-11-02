import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInputBar from '../../components/chat/ChatInputBar';
import SuggestionChips from '../../components/chat/SuggestionChips';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { chatWithAI } from '../../services/mockApi.service';
import { Colors, Spacing } from '../../constants/Colors';
import { Message } from '../../constants/Types';

const SUGGESTED_QUESTIONS = [
  'Analyze this evidence',
  'What patterns do you see?',
  'Identify potential traces',
  'Suggest next steps',
];

export default function ChatScreen() {
  const { currentChatMessages, addMessage, clearChat } = useApp();
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (currentChatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentChatMessages]);

  const handleSend = async (message: string) => {
    setIsSending(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Add user message immediately for responsive UI
    addMessage(userMessage);

    try {
      // Get AI response
      const responseMessage = await chatWithAI(
        message,
        [...currentChatMessages, userMessage]
      );

      addMessage(responseMessage);
    } catch (error) {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleClearChat = () => {
    clearChat();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {currentChatMessages.length === 0 ? (
          <EmptyState
            icon={<Text style={styles.emptyIcon}>💬</Text>}
            title="AI Forensic Assistant"
            message="Ask questions about evidence analysis, patterns, or get investigative insights"
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentChatMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatMessage message={item} />}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        {currentChatMessages.length === 0 && (
          <SuggestionChips
            suggestions={SUGGESTED_QUESTIONS}
            onSelect={handleSuggestionSelect}
          />
        )}

        {currentChatMessages.length > 0 && (
          <View style={styles.clearContainer}>
            <Button
              title="Clear Chat"
              variant="outline"
              onPress={handleClearChat}
            />
          </View>
        )}

        <ChatInputBar onSend={handleSend} disabled={isSending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
  },
  clearContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
});
