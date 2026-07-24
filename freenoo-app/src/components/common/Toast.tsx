import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppStore } from '../../store';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Icon } from './Icon';

export function Toast() {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const toast = useAppStore(s => s.toast);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (toast) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [toast]);

  if (!toast) return null;

  const bgColor = toast.type === 'success' ? '#4DFF8B22' : toast.type === 'error' ? '#FF4D4D22' : '#4D8BFF22';
  const borderColor = toast.type === 'success' ? '#4DFF8B' : toast.type === 'error' ? '#FF4D4D' : '#4D8BFF';
  const iconName = toast.type === 'success' ? 'checkmark-circle' : toast.type === 'error' ? 'close-circle' : 'information-circle';

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: bgColor, borderColor }]}>
      <Icon name={iconName} size={18} color={borderColor} />
      <Text style={styles.text} numberOfLines={3} ellipsizeMode="tail">{toast.message}</Text>
    </Animated.View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      position: 'absolute', bottom: 100, left: 20, right: 20,
      flexDirection: 'row', alignItems: 'center', gap: 10,
      padding: 14, borderRadius: theme.radius.lg,
      borderWidth: 1, zIndex: 9999,
    },
    text: { color: theme.text, fontSize: theme.font.sm, fontWeight: '600', flex: 1 },
  });
}
