import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Icon } from '../common/Icon';
import { useAppStore } from '../../store';
import { saveFileLocally, mimeTypeFor, previewFile, isPdf } from '../../utils/localFiles';

interface Props { downloadUrl: string; fileName?: string; onReset: () => void; navigation: any; }

export function ResultCard({ downloadUrl, fileName = 'result.pdf', onReset, navigation }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [status, setStatus] = useState<'saving' | 'saved' | 'error'>('saving');
  const [localUri, setLocalUri] = useState<string | null>(null);
  const showToast = useAppStore(s => s.showToast);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  async function saveLocally() {
    setStatus('saving');
    try {
      const uri = await saveFileLocally(downloadUrl, fileName);
      setLocalUri(uri);
      setStatus('saved');
    } catch (e) {
      console.error('Local save error:', e);
      setStatus('error');
    }
  }

  useEffect(() => { saveLocally(); }, [downloadUrl]);

  async function handleShare() {
    if (!localUri) return;
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localUri, { mimeType: mimeTypeFor(fileName), dialogTitle: 'Share File' });
      }
    } catch (e) {
      console.error('Share error:', e);
    }
  }

  async function handlePreview() {
    if (!localUri) return;
    if (isPdf(fileName)) {
      navigation.navigate('PdfPreviewScreen', { uri: localUri, fileName });
      return;
    }
    try {
      await previewFile(localUri, fileName);
    } catch (e: any) {
      showToast(e.message || 'No app found to open this file', 'error');
    }
  }

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
      <View style={styles.successRing}>
        <Icon name="checkmark-circle" size={36} color="#4DFF8B" />
      </View>
      <Text style={styles.title}>File Ready!</Text>
      <Text style={styles.sub}>Your file has been processed successfully.</Text>
      <Text style={styles.note}>
        {status === 'saving' ? 'Saving to your device…'
          : status === 'saved' ? 'Saved to your device · find it in Files'
          : 'Could not save to device'}
      </Text>

      {status === 'error' ? (
        <TouchableOpacity style={styles.downloadBtn} onPress={saveLocally} activeOpacity={0.8}>
          <Icon name="refresh-outline" size={17} color="#fff" />
          <Text style={styles.downloadText}>Try Again</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleShare} activeOpacity={0.8} disabled={status === 'saving'}>
            {status === 'saving' ? <ActivityIndicator color="#fff" size="small" /> : <Icon name="share-outline" size={17} color="#fff" />}
            <Text style={styles.downloadText}>{status === 'saving' ? 'Saving…' : 'Share File'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewBtn} onPress={handlePreview} activeOpacity={0.8} disabled={status === 'saving'}>
            <Icon name="eye-outline" size={17} color={theme.text} />
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.7}>
        <Text style={styles.resetText}>Process another file</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.card, borderRadius: theme.radius.xl,
      padding: 32, alignItems: 'center', borderWidth: 1,
      borderColor: '#4DFF8B44', marginTop: 24,
    },
    successRing: {
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: '#4DFF8B22', alignItems: 'center',
      justifyContent: 'center', marginBottom: 16,
      borderWidth: 2, borderColor: '#4DFF8B44',
    },
    title: { fontSize: theme.font.xl, fontWeight: '800', color: theme.text, marginBottom: 8 },
    sub: { fontSize: theme.font.sm, color: theme.textMuted, textAlign: 'center', marginBottom: 4 },
    note: { fontSize: theme.font.xs, color: theme.textMuted, marginBottom: 24, opacity: 0.7 },
    downloadBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: theme.accent, paddingVertical: 14,
      paddingHorizontal: 32, borderRadius: theme.radius.lg,
      width: '100%', justifyContent: 'center', marginBottom: 12,
    },
    downloadText: { color: '#fff', fontWeight: '700', fontSize: theme.font.md },
    previewBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: theme.surface2, borderWidth: 1, borderColor: theme.border,
      paddingVertical: 14, paddingHorizontal: 32, borderRadius: theme.radius.lg,
      width: '100%', justifyContent: 'center', marginBottom: 12,
    },
    previewText: { color: theme.text, fontWeight: '700', fontSize: theme.font.md },
    resetBtn: { padding: 8 },
    resetText: { color: theme.textMuted, fontSize: theme.font.sm, textDecorationLine: 'underline' },
  });
}
