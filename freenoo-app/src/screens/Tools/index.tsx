import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { TOOLS, TOOL_CATEGORIES } from '../../constants/tools';
import { ToolCard } from '../../components/tool/ToolCard';
import { Header } from '../../components/layout/Header';

export function ToolsScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = TOOLS.filter(t => activeCategory === 'All' || t.category === activeCategory);

  return (
    <View style={styles.container}>
      <Header title="All Tools" showMenu={false} onSearch={() => navigation.navigate('SearchScreen')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {TOOL_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.catBtnText, activeCategory === cat && styles.catBtnTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.count}>{filtered.length} tools</Text>

        {/* Tools Grid */}
        <View style={styles.grid}>
          {filtered.map(tool => (
            <View key={tool.id} style={styles.gridItem}>
              <ToolCard
                tool={tool}
                onPress={() => navigation.navigate(tool.screen || 'ToolScreen', { tool })}
              />
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    catRow: { paddingHorizontal: theme.spacing.md, gap: 8, paddingTop: theme.spacing.md, paddingBottom: 8 },
    catBtn: {
      paddingHorizontal: 16, paddingVertical: 8,
      borderRadius: theme.radius.full, backgroundColor: theme.surface,
      borderWidth: 1, borderColor: theme.border,
    },
    catBtnActive: { backgroundColor: theme.accent, borderColor: theme.accent },
    catBtnText: { fontSize: theme.font.sm, color: theme.textMuted, fontWeight: '600' },
    catBtnTextActive: { color: '#fff' },
    count: { fontSize: theme.font.xs, color: theme.textMuted, paddingHorizontal: theme.spacing.md, marginBottom: 8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: theme.spacing.md, gap: 10 },
    gridItem: { width: '47%' },
  });
}
