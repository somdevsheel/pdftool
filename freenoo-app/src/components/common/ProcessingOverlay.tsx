import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppStore } from '../../store';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Icon } from './Icon';

// Rendered as a plain absolutely-positioned overlay (sibling of the navigator at the
// App root) rather than a <Modal> — a Modal opens a separate Android Dialog window,
// and if one opens while a gesture (e.g. drag-reorder) is mid-flight elsewhere in the
// tree, that window can inherit a bad initial position and render clipped in a corner
// instead of centered. A plain View in the same window can't do that.
export function ProcessingOverlay() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { isProcessing, processingMessage, processingProgress } = useAppStore();
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.timing(spin, { toValue: 1, duration: 1000, useNativeDriver: true })
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isProcessing]);

  if (!isProcessing) return null;

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Animated.View style={[styles.spinnerRing, { transform: [{ rotate }, { scale: pulse }] }]} />
        <View style={styles.spinnerCore}>
          <Icon name="flash" size={20} color={theme.accent} />
        </View>
        <Text style={styles.title}>{processingMessage || 'Processing...'}</Text>
        {processingProgress > 0 && (
          <>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${processingProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{processingProgress}%</Text>
          </>
        )}
        <Text style={styles.sub}>Please keep the app open</Text>
      </View>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject, zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center',
    },
    card: {
      backgroundColor: theme.surface, borderRadius: theme.radius.xl,
      padding: 40, alignItems: 'center', width: 280,
      borderWidth: 1, borderColor: theme.border,
    },
    spinnerRing: {
      width: 64, height: 64, borderRadius: 32,
      borderWidth: 3, borderColor: theme.accent,
      borderTopColor: 'transparent', marginBottom: -48,
    },
    spinnerCore: {
      width: 48, height: 48, borderRadius: 24,
      backgroundColor: theme.accentSoft,
      alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    title: { color: theme.text, fontSize: theme.font.md, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
    progressBar: {
      width: '100%', height: 4, backgroundColor: theme.surface3,
      borderRadius: 2, overflow: 'hidden', marginBottom: 6,
    },
    progressFill: { height: '100%', backgroundColor: theme.accent, borderRadius: 2 },
    progressText: { color: theme.accent, fontSize: theme.font.sm, fontWeight: '700', marginBottom: 8 },
    sub: { color: theme.textMuted, fontSize: theme.font.xs, textAlign: 'center' },
  });
}
