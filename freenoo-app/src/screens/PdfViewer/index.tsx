import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Icon } from '../../components/common/Icon';
import { ensurePreviewableUri } from '../../utils/localFiles';
import { useAppStore } from '../../store';

export function PdfViewerScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const showToast = useAppStore(s => s.showToast);

  async function pickPdf() {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) {
      showToast('No file selected', 'error');
      return;
    }
    try {
      // Document picker often hands back a content:// URI on Android, which the PDF
      // viewer's native renderer can't read directly — copy to a real file path first.
      const uri = await ensurePreviewableUri(asset.uri, asset.name);
      navigation.navigate('PdfPreviewScreen', { uri, fileName: asset.name });
    } catch (e: any) {
      showToast(e.message || 'Could not open this PDF', 'error');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolHeader}>
        <View style={[styles.toolIconBox, { backgroundColor: theme.accent + '22' }]}>
          <Icon name="eye-outline" size={26} color={theme.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.toolName}>PDF Viewer</Text>
          <Text style={styles.toolDesc}>Open and read any PDF on your device</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.pickBtn} onPress={pickPdf} activeOpacity={0.7}>
        <View style={styles.pickBtnInner}>
          <Text style={styles.pickBtnPlus}>+</Text>
          <Text style={styles.pickBtnText}>Select PDF File</Text>
        </View>
        <Text style={styles.pickBtnSub}>Tap to browse files</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg, padding: theme.spacing.md },
    toolHeader: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      backgroundColor: theme.surface, borderRadius: theme.radius.lg,
      padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.border,
    },
    toolIconBox: {
      width: 52, height: 52, borderRadius: theme.radius.lg,
      alignItems: 'center', justifyContent: 'center',
    },
    toolName: { fontSize: theme.font.lg, fontWeight: '800', color: theme.text, marginBottom: 4 },
    toolDesc: { fontSize: theme.font.sm, color: theme.textMuted },
    pickBtn: {
      backgroundColor: theme.surface, borderRadius: theme.radius.lg,
      padding: 24, borderWidth: 2, borderColor: theme.border,
      borderStyle: 'dashed', alignItems: 'center',
    },
    pickBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    pickBtnPlus: { fontSize: 28, color: theme.accent, fontWeight: '300' },
    pickBtnText: { fontSize: theme.font.md, color: theme.text, fontWeight: '600' },
    pickBtnSub: { fontSize: theme.font.xs, color: theme.textMuted },
  });
}
