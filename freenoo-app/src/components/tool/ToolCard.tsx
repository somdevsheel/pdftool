import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View, Alert } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Tool } from '../../types';
import { Icon } from '../common/Icon';

interface Props { tool: Tool; onPress: () => void; size?: 'sm' | 'md' | 'lg'; }

export function ToolCard({ tool, onPress, size = 'md' }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  }
  function handlePressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }

  function handlePress() {
    if (tool.disabled) {
      Alert.alert('Coming Soon', `${tool.name} will be available in a future update.`);
      return;
    }
    onPress();
  }

  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: tool.disabled ? 0.5 : 1 }}>
      <TouchableOpacity
        style={[styles.card, isLg && styles.cardLg, isSm && styles.cardSm]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.iconBox, { backgroundColor: tool.color + '22' }, isLg && styles.iconBoxLg]}>
          <Icon {...tool.icon} size={isLg ? 26 : 20} color={tool.color} />
        </View>
        <Text style={[styles.name, isLg && styles.nameLg, isSm && styles.nameSm]} numberOfLines={1}>{tool.name}</Text>
        {!isSm && <Text style={styles.desc} numberOfLines={2}>{tool.desc}</Text>}
        <View style={[styles.colorBar, { backgroundColor: tool.color }]} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.card, borderRadius: theme.radius.lg,
      padding: 14, borderWidth: 1, borderColor: theme.border,
      overflow: 'hidden', position: 'relative',
    },
    cardLg: { padding: 20 },
    cardSm: { padding: 10, alignItems: 'center' },
    iconBox: {
      width: 40, height: 40, borderRadius: theme.radius.md,
      alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    },
    iconBoxLg: { width: 52, height: 52, borderRadius: theme.radius.lg, marginBottom: 14 },
    name: { fontSize: theme.font.sm, fontWeight: '700', color: theme.text, marginBottom: 4 },
    nameLg: { fontSize: theme.font.md },
    nameSm: { fontSize: theme.font.xs, textAlign: 'center', marginBottom: 0 },
    desc: { fontSize: theme.font.xs, color: theme.textMuted, lineHeight: 16 },
    colorBar: { position: 'absolute', top: 0, left: 0, width: 3, height: '100%', borderTopLeftRadius: theme.radius.lg },
  });
}
