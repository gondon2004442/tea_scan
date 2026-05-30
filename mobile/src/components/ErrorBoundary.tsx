import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>Ошибка загрузки</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.message}>{this.state.error.message}</Text>
            <Text style={styles.stack}>{this.state.error.stack}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#180036' },
  scroll: { flex: 1 },
  message: { fontSize: 16, color: '#c00', marginBottom: 12 },
  stack: { fontSize: 12, color: '#333', fontFamily: 'monospace' },
});
