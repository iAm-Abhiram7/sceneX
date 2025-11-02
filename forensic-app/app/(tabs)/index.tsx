import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import QuickActions from '../../components/home/QuickActions';
import ReportCard from '../../components/home/ReportCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Colors, Typography, Spacing } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const { reports, refreshReports } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshReports();
    setRefreshing(false);
  }, []);

  const recentReports = reports.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.firstName || 'User'}
          </Text>
          <Text style={styles.subtitle}>
            Welcome to SceneX Forensics
          </Text>
        </View>

        <QuickActions />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            {reports.length > 5 && (
              <Button
                title="View All"
                variant="outline"
                onPress={() => router.push('/history')}
              />
            )}
          </View>

          {recentReports.length === 0 ? (
            <EmptyState
              icon={<Text style={styles.emptyIcon}>📋</Text>}
              title="No Reports Yet"
              message="Start by analyzing evidence with the camera"
              action={
                <Button
                  title="Start Analysis"
                  onPress={() => router.push('/camera')}
                />
              }
            />
          ) : (
            recentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
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
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.h2 || Typography.sizes.h1,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  emptyIcon: {
    fontSize: 64,
  },
});
