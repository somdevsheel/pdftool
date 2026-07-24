import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Icon } from '../../components/common/Icon';
import { TOOLS } from '../../constants/tools';
import { Tool } from '../../types';
import { LocalFile, listLocalFiles, isPdf, previewFile, formatFileSize } from '../../utils/localFiles';
import { useAppStore } from '../../store';

interface Props { navigation: any; }

type ResultRow =
  | { kind: 'tool'; tool: Tool }
  | { kind: 'file'; file: LocalFile };

export function SearchScreen({ navigation }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const showToast = useAppStore(s => s.showToast);
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState<LocalFile[]>([]);

  useEffect(() => { listLocalFiles().then(setFiles); }, []);

  const q = query.trim().toLowerCase();
  const matchedTools = q
    ? TOOLS.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
    : [];
  const matchedFiles = q
    ? files.filter(f => f.name.toLowerCase().includes(q))
    : [];

  const rows: ResultRow[] = [
    ...matchedTools.map(tool => ({ kind: 'tool' as const, tool })),
    ...matchedFiles.map(file => ({ kind: 'file' as const, file })),
  ];

  function openTool(tool: Tool) {
    navigation.navigate(tool.screen || 'ToolScreen', { tool });
  }

  async function openFile(file: LocalFile) {
    if (isPdf(file.name)) {
      navigation.navigate('PdfPreviewScreen', { uri: file.uri, fileName: file.name });
      return;
    }
    try {
      await previewFile(file.uri, file.name);
    } catch (e: any) {
      showToast(e.message || 'No app found to open this file', 'error');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Icon name="search-outline" size={16} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tools and files..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Icon name="close" size={14} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {q.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={40} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>Search tools and files</Text>
          <Text style={styles.emptySub}>Start typing to find a PDF tool or a file you've saved</Text>
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="file-tray-outline" size={40} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>No results for "{query}"</Text>
          <Text style={styles.emptySub}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item, i) => (item.kind === 'tool' ? `tool-${item.tool.id}` : `file-${item.file.uri}`) + i}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            matchedTools.length > 0 ? <Text style={styles.sectionLabel}>Tools</Text> : null
          }
          renderItem={({ item, index }) => {
            const isFirstFile = item.kind === 'file' && index === matchedTools.length;
            return (
              <>
                {isFirstFile && <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Files</Text>}
                {item.kind === 'tool' ? (
                  <TouchableOpacity style={styles.row} onPress={() => openTool(item.tool)} activeOpacity={0.7}>
                    <View style={[styles.rowIconBox, { backgroundColor: item.tool.color + '22' }]}>
                      <Icon {...item.tool.icon} size={18} color={item.tool.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle} numberOfLines={1}>{item.tool.name}</Text>
                      <Text style={styles.rowSub} numberOfLines={1}>{item.tool.desc}</Text>
                    </View>
                    <Icon name="chevron-forward" size={16} color={theme.textMuted} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.row} onPress={() => openFile(item.file)} activeOpacity={0.7}>
                    <View style={[styles.rowIconBox, { backgroundColor: theme.accentSoft }]}>
                      <Icon name="document-text-outline" size={18} color={theme.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle} numberOfLines={1}>{item.file.name}</Text>
                      <Text style={styles.rowSub}>{formatFileSize(item.file.size)}</Text>
                    </View>
                    <Icon name="chevron-forward" size={16} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </>
            );
          }}
        />
      )}
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      paddingHorizontal: theme.spacing.md, paddingTop: 48, paddingBottom: 12,
      borderBottomWidth: 1, borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    backBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center',
    },
    searchBox: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      backgroundColor: theme.surface2, borderRadius: theme.radius.lg,
      paddingHorizontal: 12, paddingVertical: 10,
      borderWidth: 1, borderColor: theme.border, gap: 8,
    },
    searchInput: { flex: 1, color: theme.text, fontSize: theme.font.sm },
    clearBtn: { padding: 2 },
    list: { padding: theme.spacing.md },
    sectionLabel: {
      fontSize: theme.font.xs, color: theme.textMuted, fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
    },
    row: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: theme.surface, borderRadius: theme.radius.md,
      padding: 12, marginBottom: 8,
      borderWidth: 1, borderColor: theme.border,
    },
    rowIconBox: {
      width: 38, height: 38, borderRadius: theme.radius.md,
      alignItems: 'center', justifyContent: 'center',
    },
    rowTitle: { fontSize: theme.font.sm, fontWeight: '700', color: theme.text, marginBottom: 2 },
    rowSub: { fontSize: theme.font.xs, color: theme.textMuted },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 40 },
    emptyTitle: { fontSize: theme.font.md, fontWeight: '700', color: theme.text, textAlign: 'center' },
    emptySub: { fontSize: theme.font.sm, color: theme.textMuted, textAlign: 'center' },
  });
}
