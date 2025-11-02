import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import {
  getEmailError,
  getPasswordError,
  getNameError,
  getPasswordMatchError,
} from '../../utils/validators';
import { Colors, Typography, Spacing } from '../../constants/Colors';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    const firstNameError = getNameError(formData.firstName, 'First name');
    if (firstNameError) {
      newErrors.firstName = firstNameError;
      isValid = false;
    }

    const lastNameError = getNameError(formData.lastName, 'Last name');
    if (lastNameError) {
      newErrors.lastName = lastNameError;
      isValid = false;
    }

    const emailError = getEmailError(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const passwordError = getPasswordError(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    const confirmPasswordError = getPasswordMatchError(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      // Navigation will be handled by the root layout
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join SceneX Forensics</Text>

      <Input
        label="First Name"
        placeholder="John"
        value={formData.firstName}
        onChangeText={(value) => updateField('firstName', value)}
        autoCapitalize="words"
        error={errors.firstName}
        editable={!isLoading}
      />

      <Input
        label="Last Name"
        placeholder="Doe"
        value={formData.lastName}
        onChangeText={(value) => updateField('lastName', value)}
        autoCapitalize="words"
        error={errors.lastName}
        editable={!isLoading}
      />

      <Input
        label="Email"
        placeholder="john.doe@forensic.com"
        value={formData.email}
        onChangeText={(value) => updateField('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!isLoading}
      />

      <Input
        label="Password"
        placeholder="Minimum 6 characters"
        value={formData.password}
        onChangeText={(value) => updateField('password', value)}
        secureTextEntry={!showPassword}
        error={errors.password}
        editable={!isLoading}
        rightIcon={
          <Text style={styles.togglePassword}>
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </Text>
        }
        onRightIconPress={() => setShowPassword(!showPassword)}
      />

      <Input
        label="Confirm Password"
        placeholder="Re-enter password"
        value={formData.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        secureTextEntry={!showConfirmPassword}
        error={errors.confirmPassword}
        editable={!isLoading}
        rightIcon={
          <Text style={styles.togglePassword}>
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </Text>
        }
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <Button
        title="Create Account"
        onPress={handleSignup}
        loading={isLoading}
        fullWidth
        style={styles.signupButton}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Button
          title="Sign In"
          onPress={() => router.push('/login')}
          variant="outline"
          disabled={isLoading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
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
    marginBottom: Spacing.xl,
  },
  togglePassword: {
    fontSize: 18,
  },
  signupButton: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  footerText: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
});
