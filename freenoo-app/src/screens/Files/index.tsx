import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Header } from '../../components/layout/Header';
import { Icon } from '../../components/common/Icon';
import { LocalFile, listLocalFiles, deleteLocalFile, renameLocalFile, saveToPublicDownloads, previewFile, isPdf, formatFileSize } from '../../utils/localFiles';
import { useAppStore } from '../../store';
import * as Sharing from 'expo-sharing';

function splitName(name: string): { base: string; ext: string } {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? { base: name, ext: '' } : { base: name.slice(0, dot), ext: name.slice(dot) };
}

export function FilesScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [renameTarget, setRenameTarget] = useState<LocalFile | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [downloadingUri, setDownloadingUri] = useState<string | null>(null);
  const showToast = useAppStore(s => s.showToast);

  const refresh = useCallback(() => {
    listLocalFiles().then(setFiles).finally(() => setLoading(false));
  }, []);

  useFocusEffect(refresh);

  async function handleShare(file: LocalFile) {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { dialogTitle: 'Share File' });
      }
    } catch (e) {
      console.error('Share error:', e);
    }
  }

  function handleDelete(file: LocalFile) {
    Alert.alert('Delete File', `Delete "${file.name}" from this device?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteLocalFile(file.uri);
          refresh();
        },
      },
    ]);
  }

  async function handlePreview(file: LocalFile) {
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

  async function handleDownload(file: LocalFile) {
    setDownloadingUri(file.uri);
    try {
      await saveToPublicDownloads(file.uri, file.name);
      showToast('Saved to Downloads', 'success');
    } catch (e: any) {
      showToast(e.message || 'Could not save to Downloads', 'error');
    } finally {
      setDownloadingUri(null);
    }
  }

  function openRename(file: LocalFile) {
    setRenameTarget(file);
    setRenameValue(splitName(file.name).base);
  }

  async function confirmRename() {
    if (!renameTarget) return;
    try {
      await renameLocalFile(renameTarget.uri, renameValue);
      setRenameTarget(null);
      refresh();
    } catch (e: any) {
      Alert.alert('Could not rename', e.message || 'Please try a different name.');
    }
  }

  return (
    <View style={styles.container}>
      <Header title="My Files" showMenu={false} onSearch={() => navigation.navigate('SearchScreen')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Files</Text>
          {!loading && files.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="folder-open-outline" size={44} color={theme.textMuted} />
              <Text style={styles.emptyTitle}>No files yet</Text>
              <Text style={styles.emptySub}>Process a PDF to see it here</Text>
            </View>
          ) : (
            files.map(file => (
              <View key={file.uri} style={styles.fileCard}>
                <TouchableOpacity style={styles.fileInfoRow} onPress={() => handlePreview(file)} activeOpacity={0.7}>
                  <View style={styles.fileIconBox}>
                    <Icon name="document-text-outline" size={18} color={theme.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                    <Text style={styles.fileDate}>
                      {new Date(file.modifiedAt * 1000).toLocaleDateString()} · {formatFileSize(file.size)}
                    </Text>
                  </View>
                  <Icon name="eye-outline" size={18} color={theme.textMuted} />
                </TouchableOpacity>
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => handleDownload(file)} disabled={downloadingUri === file.uri}>
                    {downloadingUri === file.uri
                      ? <ActivityIndicator size="small" color={theme.accent} />
                      : <Icon name="download-outline" size={16} color={theme.accent} />}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => handleShare(file)}>
                    <Icon name="share-outline" size={16} color={theme.accent} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => openRename(file)}>
                    <Icon name="create-outline" size={16} color={theme.textSoft} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(file)}>
                    <Icon name="trash-outline" size={16} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={!!renameTarget} transparent animationType="fade" onRequestClose={() => setRenameTarget(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename File</Text>
            <View style={styles.renameRow}>
              <TextInput
                style={styles.renameInput}
                value={renameValue}
                onChangeText={setRenameValue}
                placeholder="File name"
                placeholderTextColor={theme.textMuted}
                autoFocus
                selectTextOnFocus
              />
              <Text style={styles.renameExt}>{renameTarget ? splitName(renameTarget.name).ext : ''}</Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setRenameTarget(null)} activeOpacity={0.7}>
                <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={confirmRename} activeOpacity={0.8}>
                <Text style={styles.modalBtnPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    section: { padding: theme.spacing.md, paddingTop: theme.spacing.lg },
    sectionTitle: { fontSize: theme.font.lg, fontWeight: '700', color: theme.text, marginBottom: 12 },
    emptyState: { alignItems: 'center', paddingVertical: 40, gap: 12 },
    emptyTitle: { fontSize: theme.font.md, fontWeight: '700', color: theme.text },
    emptySub: { fontSize: theme.font.sm, color: theme.textMuted },
    fileCard: {
      backgroundColor: theme.surface, borderRadius: theme.radius.md,
      padding: 14, marginBottom: 8, borderWidth: 1, borderColor: theme.border,
      gap: 12,
    },
    fileInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    fileIconBox: {
      width: 40, height: 40, borderRadius: theme.radius.md,
      backgroundColor: theme.accentSoft, alignItems: 'center', justifyContent: 'center',
    },
    fileName: { fontSize: theme.font.sm, color: theme.text, fontWeight: '600', marginBottom: 2 },
    fileDate: { fontSize: theme.font.xs, color: theme.textMuted },
    actionsRow: {
      flexDirection: 'row', gap: 8,
      borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 12,
    },
    iconBtn: {
      flex: 1, height: 34, borderRadius: theme.radius.md,
      backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center',
    },
    modalOverlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24,
    },
    modalCard: {
      width: '100%', maxWidth: 360, backgroundColor: theme.surface, borderRadius: theme.radius.xl,
      padding: 20, borderWidth: 1, borderColor: theme.border,
    },
    modalTitle: { fontSize: theme.font.md, fontWeight: '800', color: theme.text, marginBottom: 14 },
    renameRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: theme.surface2, borderRadius: theme.radius.md,
      borderWidth: 1, borderColor: theme.border, paddingHorizontal: 12,
    },
    renameInput: { flex: 1, color: theme.text, fontSize: theme.font.sm, paddingVertical: 12 },
    renameExt: { color: theme.textMuted, fontSize: theme.font.sm },
    modalActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
    modalBtnSecondary: {
      flex: 1, paddingVertical: 12, borderRadius: theme.radius.md,
      alignItems: 'center', borderWidth: 1, borderColor: theme.border,
    },
    modalBtnSecondaryText: { color: theme.textMuted, fontWeight: '600', fontSize: theme.font.sm },
    modalBtnPrimary: {
      flex: 1, paddingVertical: 12, borderRadius: theme.radius.md,
      alignItems: 'center', backgroundColor: theme.accent,
    },
    modalBtnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: theme.font.sm },
  });
}
