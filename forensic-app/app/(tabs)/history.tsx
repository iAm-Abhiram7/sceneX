import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/history/SearchBar';
import HistoryItem from '../../components/history/HistoryItem';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Colors, Typography, Spacing } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const { reports, deleteReport } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredReports = reports.filter((report) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.caseId.toLowerCase().includes(query) ||
      report.summary.toLowerCase().includes(query) ||
      report.evidenceTags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteReport(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Report History</Text>
        <Text style={styles.subtitle}>
          {reports.length} {reports.length === 1 ? 'report' : 'reports'} total
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by case ID, summary, or tags..."
        />
      </View>

      {filteredReports.length === 0 ? (
        <EmptyState
          icon={<Text style={styles.emptyIcon}>📋</Text>}
          title={searchQuery ? 'No Results Found' : 'No Reports Yet'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Start by analyzing evidence with the camera'
          }
          action={
            !searchQuery && (
              <Button
                title="Start Analysis"
                onPress={() => router.push('/camera')}
              />
            )
          }
        />
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem report={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
  },
  list: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  emptyIcon: {
    fontSize: 64,
  },
});
