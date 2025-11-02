import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  analyzeImage,
  generateReport,
  extractEvidenceTags,
} from '../../services/mockApi.service';
import { Colors, Typography, Spacing } from '../../constants/Colors';
import { Message, Report } from '../../constants/Types';
import { formatCaseId, generateSummary } from '../../utils/formatters';

export default function CameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { saveReport } = useApp();
  const { user } = useAuth();
  const router = useRouter();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to capture evidence'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeEvidence = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      const analysisText = await analyzeImage(image);
      const tags = await extractEvidenceTags(analysisText);
      const analysisTimestamp = new Date();
      const aiTimestamp = new Date(analysisTimestamp.getTime() + 1);

      const userMessage: Message = {
        id: `msg-${analysisTimestamp.getTime()}`,
        role: 'user',
        content: 'Analyze the captured evidence image.',
        imageUri: image,
        timestamp: analysisTimestamp,
      };

      const aiMessage: Message = {
        id: `msg-${analysisTimestamp.getTime()}-ai`,
        role: 'assistant',
        content: analysisText,
        timestamp: aiTimestamp,
      };

      const chatHistory: Message[] = [userMessage, aiMessage];
      const reportContent = await generateReport(chatHistory, tags);
      const summary = generateSummary(analysisText, 2);

      const reportData: Omit<Report, 'id' | 'timestamp'> = {
        caseId: formatCaseId(),
        userId: user?.id ?? 'guest-user',
        images: [
          {
            uri: image,
            uploadedAt: analysisTimestamp,
          },
        ],
        chatHistory,
        reportContent,
        evidenceTags: tags,
        summary,
        status: 'completed',
      };

      const createdReport = await saveReport(reportData);

      Alert.alert('Analysis Complete', 'Evidence has been analyzed and saved', [
        {
          text: 'View Report',
          onPress: () => router.push(`/report/${createdReport.id}`),
        },
        {
          text: 'OK',
          onPress: () => setImage(null),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Analysis Failed', error.message || 'Please try again');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Evidence Analysis</Text>
          <Text style={styles.subtitle}>
            Capture or select an image to analyze
          </Text>
        </View>

        {image ? (
          <Card variant="elevated" style={styles.imageCard}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.imageActions}>
              <Button
                title="Retake"
                variant="outline"
                onPress={() => setImage(null)}
                disabled={isAnalyzing}
              />
              <Button
                title="Analyze"
                onPress={analyzeEvidence}
                loading={isAnalyzing}
                style={styles.analyzeButton}
              />
            </View>
          </Card>
        ) : (
          <View style={styles.captureSection}>
            <Text style={styles.captureIcon}>📷</Text>
            <Text style={styles.captureText}>
              No image selected
            </Text>
            <View style={styles.captureActions}>
              <Button
                title="Take Photo"
                onPress={takePhoto}
                fullWidth
                style={styles.actionButton}
              />
              <Button
                title="Choose from Gallery"
                variant="secondary"
                onPress={pickImage}
                fullWidth
                style={styles.actionButton}
              />
            </View>
          </View>
        )}

        {isAnalyzing && (
          <LoadingSpinner message="Analyzing evidence..." />
        )}

        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoTitle}>📋 Guidelines</Text>
          <Text style={styles.infoText}>
            • Ensure good lighting{'\n'}
            • Keep the camera steady{'\n'}
            • Capture the entire evidence{'\n'}
            • Avoid reflections and shadows{'\n'}
            • Multiple angles recommended
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
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
  imageCard: {
    marginBottom: Spacing.lg,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: Spacing.md,
    backgroundColor: Colors.border,
  },
  imageActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  analyzeButton: {
    flex: 1,
  },
  captureSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  captureIcon: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  captureText: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  captureActions: {
    width: '100%',
    gap: Spacing.md,
  },
  actionButton: {
    marginBottom: 0,
  },
  infoCard: {
    marginTop: Spacing.lg,
  },
  infoTitle: {
    fontSize: Typography.sizes.h3 || Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
