import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { AiSource } from '../lib/aiClient';

type Props = {
  answer: string;
  sources: AiSource[];
};

function openUrl(url: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener');
  } else {
    void Linking.openURL(url);
  }
}

export function AiResultCard({ answer, sources }: Props) {
  if (!answer) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.badge}>✨ Gongfu sommelier</Text>
      <Text style={styles.answer}>{answer}</Text>
      {sources.length > 0 && (
        <View style={styles.sources}>
          <Text style={styles.sourcesTitle}>Sources</Text>
          {sources.slice(0, 4).map((s) => (
            <Pressable key={s.url} onPress={() => openUrl(s.url)}>
              <Text style={styles.sourceLink} numberOfLines={1}>
                {s.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.aiAnswerBg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    gap: 10,
  },
  badge: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(24, 0, 54, 0.6)',
  },
  answer: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  sources: {
    marginTop: 4,
    gap: 4,
  },
  sourcesTitle: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(24, 0, 54, 0.5)',
  },
  sourceLink: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 13,
    color: colors.sourceLink,
    textDecorationLine: 'underline',
  },
});
