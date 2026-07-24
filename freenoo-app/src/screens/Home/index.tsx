import React, { useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, FlatList, Animated,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { TOOLS, FEATURED_TOOLS } from '../../constants/tools';
import { ToolCard } from '../../components/tool/ToolCard';
import { Header } from '../../components/layout/Header';
import { Icon } from '../../components/common/Icon';

const BADGES = [
  { icon: 'lock-closed-outline', label: '100% Free' },
  { icon: 'person-outline', label: 'Anonymous' },
  { icon: 'flash-outline', label: 'Fast' },
  { icon: 'shield-checkmark-outline', label: 'Secure' },
] as const;

export function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Header onSearch={() => navigation.navigate('SearchScreen')} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Icon name="flash" size={13} color={theme.accent} />
            <Text style={styles.heroBadgeText}>Free PDF Tools</Text>
          </View>
          <Text style={styles.heroTitle}>
            Every PDF Tool{'\n'}
            <Text style={styles.heroAccent}>in One Place</Text>
          </Text>
          <Text style={styles.heroSub}>
            No signup. No watermarks. Files deleted after 60 minutes.
          </Text>

          {/* Feature Badges */}
          <View style={styles.badgeRow}>
            {BADGES.map((b, i) => (
              <View key={i} style={styles.badge}>
                <Icon name={b.icon} size={12} color={theme.textSoft} />
                <Text style={styles.badgeLabel}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Tools</Text>
          <View style={styles.grid}>
            {FEATURED_TOOLS.map(tool => (
              <View key={tool.id} style={styles.gridItem}>
                <ToolCard
                  tool={tool}
                  onPress={() => navigation.navigate(tool.screen || 'ToolScreen', { tool })}
                />
              </View>
            ))}
          </View>
        </View>

        {/* All Tools */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Tools</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tools')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {TOOLS.map(tool => (
              <View key={tool.id} style={styles.gridItem}>
                <ToolCard
                  tool={tool}
                  onPress={() => navigation.navigate(tool.screen || 'ToolScreen', { tool })}
                  size="sm"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Footer Banner */}
        <View style={styles.footerBanner}>
          <Text style={styles.footerFlag}>🇮🇳</Text>
          <View>
            <Text style={styles.footerTitle}>Make in India</Text>
            <Text style={styles.footerSub}>Built for the world · Free forever</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    hero: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    heroBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      alignSelf: 'flex-start',
      backgroundColor: theme.accentSoft,
      borderRadius: theme.radius.full,
      paddingHorizontal: 12, paddingVertical: 5,
      borderWidth: 1, borderColor: theme.accentGlow,
      marginBottom: 12,
    },
    heroBadgeText: { color: theme.accent, fontSize: theme.font.xs, fontWeight: '700' },
    heroTitle: {
      fontSize: theme.font.xxxl, fontWeight: '800',
      color: theme.text, lineHeight: 40, marginBottom: 10,
    },
    heroAccent: { color: theme.accent },
    heroSub: { fontSize: theme.font.sm, color: theme.textMuted, marginBottom: 16, lineHeight: 20 },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    badge: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      backgroundColor: theme.surface2, borderRadius: theme.radius.full,
      paddingHorizontal: 10, paddingVertical: 5,
      borderWidth: 1, borderColor: theme.border,
    },
    badgeLabel: { fontSize: theme.font.xs, color: theme.textSoft, fontWeight: '600' },
    section: { padding: theme.spacing.md, paddingTop: theme.spacing.lg },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: theme.font.lg, fontWeight: '700', color: theme.text, marginBottom: 12 },
    seeAll: { fontSize: theme.font.sm, color: theme.accent, fontWeight: '600' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    gridItem: { width: '47%' },
    footerBanner: {
      margin: theme.spacing.md,
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: theme.surface, borderRadius: theme.radius.lg,
      padding: 16, borderWidth: 1, borderColor: theme.border,
    },
    footerFlag: { fontSize: 32 },
    footerTitle: { fontSize: theme.font.md, fontWeight: '700', color: theme.text },
    footerSub: { fontSize: theme.font.xs, color: theme.textMuted },
  });
}
