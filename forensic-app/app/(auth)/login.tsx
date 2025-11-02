import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import LoginForm from '../../components/auth/LoginForm';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
