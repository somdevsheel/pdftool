import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';

const LOGO = require('../../../assets/logo.png');

interface Props {
  title?: string;
  showSearch?: boolean;
  showMenu?: boolean;
  onSearch?: () => void;
  onMenu?: () => void;
}

export function Header({ title, showSearch = true, showMenu = true, onSearch, onMenu }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      <View style={styles.left}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      <View style={styles.right}>
        {showSearch && (
          <TouchableOpacity style={styles.iconBtn} onPress={onSearch} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={17} color={theme.text} />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity style={styles.iconBtn} onPress={onMenu} activeOpacity={0.7}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>F</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm,
      paddingTop: 48, backgroundColor: theme.bg,
      borderBottomWidth: 1, borderBottomColor: theme.border,
    },
    left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    logo: { width: 38, height: 24 },
    title: { fontSize: theme.font.md, fontWeight: '700', color: theme.text },
    right: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    iconBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center',
    },
    avatar: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { color: '#fff', fontSize: theme.font.md, fontWeight: '700' },
  });
}
