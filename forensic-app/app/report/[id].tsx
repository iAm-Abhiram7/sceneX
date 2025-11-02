import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatTime } from '../../utils/formatters';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Colors';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const { reports, deleteReport } = useApp();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Report Not Found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            await deleteReport(report.id);
            router.back();
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'in_progress':
        return Colors.warning;
      case 'pending':
        return Colors.accent;
      default:
        return Colors.textSecondary;
    }
  };

  if (isDeleting) {
    return <LoadingSpinner fullScreen message="Deleting report..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.caseId}>{report.caseId}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(report.status) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(report.status) },
                ]}
              >
                {report.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.date}>
            {formatDate(report.timestamp)} at {formatTime(report.timestamp)}
          </Text>
        </View>

        {/* Images */}
        {report.images.length > 0 && (
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>Evidence Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.uri }}
                  style={styles.evidenceImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </Card>
        )}

        {/* Summary */}
        <Card variant="elevated" style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.summaryText}>{report.summary}</Text>
        </Card>

        {/* Evidence Tags */}
        {report.evidenceTags.length > 0 && (
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>Evidence Tags</Text>
            <View style={styles.tagsContainer}>
              {report.evidenceTags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Chat History */}
        {report.chatHistory.length > 0 && (
          <Card variant="elevated" style={styles.card}>
            <Text style={styles.cardTitle}>Analysis Chat History</Text>
            {report.chatHistory.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.chatMessage,
                  message.role === 'user' && styles.userMessage,
                ]}
              >
                <Text style={styles.chatRole}>
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </Text>
                <Text style={styles.chatContent}>{message.content}</Text>
                <Text style={styles.chatTime}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Delete Report"
            variant="danger"
            onPress={handleDelete}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  caseId: {
    fontSize: Typography.sizes.h2 || Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.small || 4,
  },
  statusText: {
    fontSize: Typography.sizes.small || Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },
  date: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.sizes.h3 || Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  evidenceImage: {
    width: 200,
    height: 150,
    borderRadius: BorderRadius.medium || 8,
    marginRight: Spacing.sm,
    backgroundColor: Colors.border,
  },
  summaryText: {
    fontSize: Typography.sizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.sage + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small || 4,
  },
  tagText: {
    fontSize: Typography.sizes.body,
    color: Colors.sage,
    fontWeight: Typography.weights.medium,
  },
  chatMessage: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium || 8,
    marginBottom: Spacing.sm,
  },
  userMessage: {
    backgroundColor: Colors.accent + '10',
  },
  chatRole: {
    fontSize: Typography.sizes.small || Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.accent,
    marginBottom: Spacing.xs,
  },
  chatContent: {
    fontSize: Typography.sizes.body,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  chatTime: {
    fontSize: Typography.sizes.tiny || Typography.sizes.small,
    color: Colors.textSecondary,
  },
  actions: {
    padding: Spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: Typography.sizes.h2 || Typography.sizes.h1,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
});
