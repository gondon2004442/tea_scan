import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { DesignFrame } from '../src/components/DesignFrame';
import { ScreenShell } from '../src/components/ScreenShell';
import { ScrollUnderHeader } from '../src/components/ScrollUnderHeader';
import { TeaCard } from '../src/components/TeaCard';
import { useTeaModal } from '../src/context/TeaModalContext';
import { type Tea } from '../src/data/teas';
import { aiExplainQuiz } from '../src/lib/aiClient';
import { QUIZ_QUESTIONS, matchQuiz } from '../src/lib/quizMatch';
import { useFavorites } from '../src/hooks/useFavorites';
import { useRequireAuth } from '../src/hooks/useRequireAuth';
import { useTimeOfDay } from '../src/hooks/useTimeOfDay';
import { colors, layout, timePalettes } from '../src/theme';

export default function QuizScreen() {
  const router = useRouter();
  const { openTea } = useTeaModal();
  const { hasMyTeasTab } = useFavorites();
  useRequireAuth();
  const { timeOfDay } = useTimeOfDay();

  const tabMode = hasMyTeasTab ? 'dual' : 'exploreOnly';

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Tea[] | null>(null);
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);

  const question = QUIZ_QUESTIONS[step];

  function pick(optionId: string) {
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      finish(next);
    }
  }

  async function finish(finalAnswers: Record<string, string>) {
    const teas = matchQuiz(finalAnswers);
    setResults(teas);
    setExplaining(true);
    const text = await aiExplainQuiz(
      finalAnswers,
      teas.map((t) => t.id),
    );
    setExplanation(text);
    setExplaining(false);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResults(null);
    setExplanation('');
  }

  return (
    <DesignFrame>
      <ScreenShell colors={timePalettes.quiz[timeOfDay]} locations={[0, 0.6]}>
        <ScrollUnderHeader
          activeTab="quiz"
          tabMode={tabMode}
          onTabChange={(tab) => {
            if (tab === 'my') router.replace('/my-teas');
            if (tab === 'explore') router.replace('/explore');
          }}
          paddingTop={layout.exploreFiltersTopExploreOnly}
          contentContainerStyle={styles.content}
        >
          {!results ? (
            <View style={styles.quizBox}>
              <Text style={styles.progress}>
                {step + 1} / {QUIZ_QUESTIONS.length}
              </Text>
              <Text style={styles.prompt}>{question.prompt}</Text>
              <View style={styles.options}>
                {question.options.map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={styles.option}
                    onPress={() => pick(opt.id)}
                  >
                    <Text style={styles.optionText}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Your Gongfu picks</Text>
              {explaining ? (
                <View style={styles.statusRow}>
                  <ActivityIndicator color={colors.textPrimary} />
                  <Text style={styles.statusText}>Brewing your recommendations…</Text>
                </View>
              ) : explanation ? (
                <Text style={styles.explanation}>{explanation}</Text>
              ) : null}
              <View style={styles.cards}>
                {results.map((tea) => (
                  <TeaCard
                    key={tea.id}
                    tea={tea}
                    variant="grid"
                    onPress={() => openTea(tea.id)}
                  />
                ))}
              </View>
              <Pressable style={styles.restart} onPress={restart}>
                <Text style={styles.restartText}>Start over</Text>
              </Pressable>
            </View>
          )}
        </ScrollUnderHeader>
      </ScreenShell>
    </DesignFrame>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  quizBox: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  progress: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 13,
    color: 'rgba(24, 0, 54, 0.5)',
  },
  prompt: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  options: {
    gap: 12,
    marginTop: 8,
  },
  option: {
    height: 56,
    borderRadius: 1000,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 16,
    color: colors.textPrimary,
  },
  resultsBox: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  resultsTitle: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 14,
    color: colors.textPrimary,
  },
  explanation: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: layout.gridGap,
    rowGap: layout.gridGap,
    marginTop: 4,
  },
  restart: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: colors.filterBorder,
  },
  restartText: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 15,
    color: colors.textPrimary,
  },
});
