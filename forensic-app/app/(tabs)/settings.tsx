import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Colors, Typography, Spacing } from '../../constants/Colors';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { reports } = useApp();
  const router = useRouter();
  const userRoleLabel =
    user?.email?.toLowerCase() === 'admin@forensic.com' ? 'Administrator' : 'User';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* User Info */}
        <Card variant="elevated" style={styles.card}>
          <Text style={styles.cardTitle}>Profile Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{userRoleLabel}</Text>
          </View>
        </Card>

        {/* Statistics */}
        <Card variant="elevated" style={styles.card}>
          <Text style={styles.cardTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reports.length}</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {reports.filter((r) => r.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {reports.filter((r) => r.status === 'in_progress').length}
              </Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
          </View>
        </Card>

        {/* App Info */}
        <Card variant="outlined" style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mode</Text>
            <Text style={styles.infoValue}>Mock (No Backend)</Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Logout"
            variant="danger"
            onPress={handleLogout}
            fullWidth
          />
        </View>

        <Text style={styles.footer}>
          SceneX Forensics © 2024{'\n'}
          Zen Garden & Tatami Edition
        </Text>
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
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '30',
  },
  infoLabel: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.sizes.body,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Typography.sizes.h2 || Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.accent,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.small || Typography.sizes.body,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  footer: {
    textAlign: 'center',
    fontSize: Typography.sizes.small || Typography.sizes.body,
    color: Colors.textSecondary,
    paddingVertical: Spacing.xl,
    lineHeight: 20,
  },
});
