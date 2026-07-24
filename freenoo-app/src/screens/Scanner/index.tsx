import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Platform, PermissionsAndroid } from 'react-native';
import DocumentScanner, { ScanDocumentResponseStatus } from 'react-native-document-scanner-plugin';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { uploadFile } from '../../api/services/upload.service';
import { createJob, pollJob } from '../../api/services/job.service';
import { ENDPOINTS } from '../../api/endpoints';
import { useAppStore } from '../../store';
import { ResultCard } from '../../components/tool/ResultCard';
import { Icon } from '../../components/common/Icon';

export function ScannerScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { setProcessing, showToast } = useAppStore();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [scannedImages, setScannedImages] = useState<string[]>([]);

  async function ensureCameraPermission(): Promise<boolean> {
    // iOS's native document scanner (VisionKit) prompts for camera access itself.
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera Permission',
      message: 'FreeNoo needs camera access to scan documents.',
      buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async function handleCamera() {
    const allowed = await ensureCameraPermission();
    if (!allowed) {
      Alert.alert('Permission needed', 'Camera permission is required to scan documents.');
      return;
    }
    try {
      // Opens the native scanner: live edge detection with an auto-tracking
      // green quadrilateral, auto-capture on alignment, perspective correction.
      const { scannedImages: pages, status } = await DocumentScanner.scanDocument({ maxNumDocuments: 20 });
      if (status === ScanDocumentResponseStatus.Success && pages?.length) {
        setScannedImages(prev => [...prev, ...pages]);
      }
    } catch (e: any) {
      Alert.alert('Scanner error', e?.message || 'Could not open the scanner.');
    }
  }

  function removeImage(index: number) {
    setScannedImages(prev => prev.filter((_, i) => i !== index));
  }

  async function handleConvertToPdf() {
    if (scannedImages.length === 0) return;
    setProcessing(true, 'Converting to PDF...');
    try {
      const fileIds: string[] = [];
      for (let i = 0; i < scannedImages.length; i++) {
        const id = await uploadFile(scannedImages[i], `scan-${i}.jpg`, 'image/jpeg');
        fileIds.push(id);
      }
      const jobId = await createJob(ENDPOINTS.convert, { fileIds });
      await pollJob(jobId);
      setDownloadUrl(ENDPOINTS.download(jobId));
      showToast('PDF created!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed', 'error');
    } finally {
      setProcessing(false);
    }
  }

  function reset() { setScannedImages([]); setDownloadUrl(null); }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scanner</Text>
        <Text style={styles.headerSub}>Scan and convert to PDF</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!downloadUrl ? (
          <>
            {/* Scan area */}
            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <Icon name="scan-outline" size={36} color={theme.textMuted} />
                <Text style={styles.scanText}>
                  {scannedImages.length > 0 ? `${scannedImages.length} page(s) scanned` : 'Scan a document'}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.scanBtn} onPress={handleCamera} activeOpacity={0.8}>
                <Icon name="camera-outline" size={18} color="#fff" />
                <Text style={styles.scanBtnText}>Scan</Text>
              </TouchableOpacity>
            </View>

            {/* Scanned page thumbnails */}
            {scannedImages.length > 0 && (
              <View style={styles.thumbGrid}>
                {scannedImages.map((uri, i) => (
                  <View key={uri + i} style={styles.thumbItem}>
                    <Image source={{ uri }} style={styles.thumbImage} />
                    <View style={styles.thumbBadge}>
                      <Text style={styles.thumbBadgeText}>{i + 1}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.thumbRemove}
                      onPress={() => removeImage(i)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={13} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {scannedImages.length > 0 && (
              <TouchableOpacity style={styles.convertBtn} onPress={handleConvertToPdf} activeOpacity={0.8}>
                <Text style={styles.convertBtnText}>Convert {scannedImages.length} page(s) to PDF →</Text>
              </TouchableOpacity>
            )}

            {scannedImages.length > 0 && (
              <TouchableOpacity onPress={() => setScannedImages([])}>
                <Text style={styles.clearText}>Clear all scans</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <ResultCard downloadUrl={downloadUrl} fileName="scanned.pdf" onReset={reset} navigation={navigation} />
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
      padding: theme.spacing.md, paddingTop: 52,
      borderBottomWidth: 1, borderBottomColor: theme.border,
    },
    headerTitle: { fontSize: theme.font.xl, fontWeight: '800', color: theme.text },
    headerSub: { fontSize: theme.font.sm, color: theme.textMuted },
    content: { padding: theme.spacing.md },
    scanArea: { alignItems: 'center', paddingVertical: 32 },
    scanFrame: {
      width: 280, height: 200, borderRadius: theme.radius.lg,
      backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center', gap: 8,
      position: 'relative', borderWidth: 1, borderColor: theme.border,
    },
    corner: {
      position: 'absolute', width: 20, height: 20,
      borderColor: theme.accent, borderWidth: 2,
    },
    cornerTL: { top: 10, left: 10, borderRightWidth: 0, borderBottomWidth: 0 },
    cornerTR: { top: 10, right: 10, borderLeftWidth: 0, borderBottomWidth: 0 },
    cornerBL: { bottom: 10, left: 10, borderRightWidth: 0, borderTopWidth: 0 },
    cornerBR: { bottom: 10, right: 10, borderLeftWidth: 0, borderTopWidth: 0 },
    scanText: { fontSize: theme.font.sm, color: theme.textMuted },
    actionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    thumbGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    thumbItem: {
      width: '31%', aspectRatio: 3 / 4, borderRadius: theme.radius.md,
      overflow: 'hidden', backgroundColor: theme.surface,
      borderWidth: 1, borderColor: theme.border, position: 'relative',
    },
    thumbImage: { width: '100%', height: '100%' },
    thumbBadge: {
      position: 'absolute', bottom: 4, left: 4,
      backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: theme.radius.full,
      width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    },
    thumbBadgeText: { color: '#fff', fontSize: theme.font.xs, fontWeight: '700' },
    thumbRemove: {
      position: 'absolute', top: 4, right: 4,
      backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: theme.radius.full,
      width: 22, height: 22, alignItems: 'center', justifyContent: 'center',
    },
    scanBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: theme.accent, borderRadius: theme.radius.lg,
      padding: 16,
    },
    scanBtnText: { color: '#fff', fontWeight: '700', fontSize: theme.font.md },
    convertBtn: {
      backgroundColor: theme.accent, borderRadius: theme.radius.lg,
      padding: 16, alignItems: 'center', marginBottom: 12,
    },
    convertBtnText: { color: '#fff', fontWeight: '700', fontSize: theme.font.md },
    clearText: { color: theme.textMuted, fontSize: theme.font.sm, textAlign: 'center', textDecorationLine: 'underline' },
  });
}
