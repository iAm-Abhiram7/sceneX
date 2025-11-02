import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../common/Card';
import { Report } from '../../constants/Types';
import { formatDate, formatCaseId } from '../../utils/formatters';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Colors';

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {
  const router = useRouter();

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <Card
      variant="elevated"
      onPress={() => router.push(`/report/${report.id}`)}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.caseId}>{formatCaseId(report.caseId)}</Text>
          <Text style={styles.date}>{formatDate(report.timestamp)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(report.status) + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(report.status) }]}
          >
            {getStatusLabel(report.status)}
          </Text>
        </View>
      </View>

      {report.images.length > 0 && report.images[0]?.uri && (
        <Image
          source={{ uri: report.images[0].uri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      <Text style={styles.summary} numberOfLines={3}>
        {report.summary}
      </Text>

      {report.evidenceTags.length > 0 && (
        <View style={styles.tags}>
          {report.evidenceTags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {report.evidenceTags.length > 3 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                +{report.evidenceTags.length - 3}
              </Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  caseId: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.border,
  },
  summary: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: Colors.sage + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: Typography.sizes.xs,
    color: Colors.sage,
    fontWeight: Typography.weights.medium,
  },
});
