import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { getEmailError, getPasswordError } from '../../utils/validators';
import { Colors, Typography, Spacing } from '../../constants/Colors';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    const emailError = getEmailError(email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by the root layout
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Input
        label="Email"
        placeholder="admin@forensic.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!isLoading}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
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

      <Button
        title="Sign In"
        onPress={handleLogin}
        loading={isLoading}
        fullWidth
        style={styles.loginButton}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Button
          title="Sign Up"
          onPress={() => router.push('/signup')}
          variant="outline"
          disabled={isLoading}
        />
      </View>

      <View style={styles.divider} />

      <Text style={styles.testCredentials}>
        Test Credentials:{'\n'}
        admin@forensic.com / admin123{'\n'}
        user@forensic.com / user123
      </Text>
    </View>
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
  loginButton: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  testCredentials: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
