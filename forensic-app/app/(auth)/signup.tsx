import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import SignupForm from '../../components/auth/SignupForm';
import { Colors } from '../../constants/Colors';

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SignupForm />
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
  },
});
