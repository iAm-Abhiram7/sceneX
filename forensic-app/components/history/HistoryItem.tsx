import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Report } from '../../constants/Types';
import { formatDate, formatCaseId } from '../../utils/formatters';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Colors';

interface HistoryItemProps {
  report: Report;
  onDelete?: (id: string) => void;
}

export default function HistoryItem({ report, onDelete }: HistoryItemProps) {
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/report/${report.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(report.status) },
          ]}
        />
        <View style={styles.content}>
          <Text style={styles.caseId}>{formatCaseId(report.caseId)}</Text>
          <Text style={styles.summary} numberOfLines={2}>
            {report.summary}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.date}>{formatDate(report.timestamp)}</Text>
            {report.evidenceTags.length > 0 && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.tagCount}>
                  {report.evidenceTags.length} tags
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete(report.id);
          }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIndicator: {
    width: 4,
    height: '100%',
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  caseId: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summary: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.xs,
  },
  tagCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.sage,
    fontWeight: Typography.weights.medium,
  },
  deleteButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  deleteIcon: {
    fontSize: 20,
  },
});
