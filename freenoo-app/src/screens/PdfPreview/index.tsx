import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import Pdf, { PdfRef } from 'react-native-pdf';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { Icon } from '../../components/common/Icon';
import { saveToPublicDownloads, mimeTypeFor } from '../../utils/localFiles';
import { getLastPage, setLastPage } from '../../utils/readingProgress';
import { TOOLS } from '../../constants/tools';
import { useAppStore } from '../../store';

interface Props {
  navigation: any;
  route: { params: { uri: string; fileName?: string } };
}

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.5;

// Single-file tools that make sense to jump into directly from a PDF that's already
// open, so the current file doesn't need to be picked again from scratch.
const QUICK_ACTION_IDS = ['compress', 'split', 'rotate', 'protect'];

// A real stack screen rather than a floating <Modal> — react-native-pdf's native
// view rendered inside RN's Android Modal (a separate Dialog window) came out
// blank/transparent with no error, a known class of SurfaceView-in-Dialog
// compositing issue. Rendering it as a normal pushed screen puts it in the same
// window as every other screen, which sidesteps that entirely.
//
// Chrome is kept to a single header + one "more" sheet (Adobe/Drive-style) so the
// reading surface stays full-screen instead of stacking permanently-visible toolbars.
export function PdfPreviewScreen({ navigation, route }: Props) {
  const { uri, fileName } = route.params;
  const theme = useTheme();
  const styles = makeStyles(theme);
  const showToast = useAppStore(s => s.showToast);
  const pdfRef = useRef<PdfRef>(null);

  const [pageInfo, setPageInfo] = useState<{ page: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [scale, setScale] = useState(1);
  const [horizontal, setHorizontal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [jumpVisible, setJumpVisible] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const hasLoadedRef = useRef(false);

  function handleError(e: any) {
    // Once the document has already rendered successfully once, any further error —
    // password-flavored or not — is a spurious re-validation glitch some encrypted
    // PDFs trigger while rendering later pages during scroll, not a real failure.
    // Acting on it would re-lock (or blank out) a document that's already open and
    // working, which is worse than just ignoring a rare genuine late error.
    if (hasLoadedRef.current) return;
    const message = e?.message ? String(e.message) : 'Could not open this PDF.';
    if (/password|decrypt|encrypt/i.test(message)) {
      setNeedsPassword(true);
      setPasswordError(!!password);
      return;
    }
    setError(message);
  }

  function submitPassword() {
    setPasswordError(false);
    setError(null);
    setNeedsPassword(false);
    setPassword(passwordInput);
  }

  function zoom(delta: number) {
    setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, +(s + delta).toFixed(2))));
  }

  function openJump() {
    setJumpInput(String(pageInfo?.page || 1));
    setJumpVisible(true);
  }

  function submitJump() {
    const n = parseInt(jumpInput, 10);
    if (pageInfo && n >= 1 && n <= pageInfo.total) {
      pdfRef.current?.setPage(n);
    }
    setJumpVisible(false);
  }

  async function handleShare() {
    setMenuVisible(false);
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: mimeTypeFor(fileName || 'file.pdf'), dialogTitle: 'Share File' });
      }
    } catch (e) {
      console.error('Share error:', e);
    }
  }

  async function handlePrint() {
    setMenuVisible(false);
    try {
      // A raw file:// path leaves Android's system print preview blank on many
      // devices — a content:// URI (via the same FileProvider hookup used for
      // "open with") is what the print/share system UI is actually built around.
      const printUri = uri.startsWith('file://') ? await FileSystem.getContentUriAsync(uri) : uri;
      await Print.printAsync({ uri: printUri });
    } catch (e: any) {
      showToast(e.message || 'Could not print this PDF', 'error');
    }
  }

  async function handleDownload() {
    setMenuVisible(false);
    setDownloading(true);
    try {
      await saveToPublicDownloads(uri, fileName || 'document.pdf');
      showToast('Saved to Downloads', 'success');
    } catch (e: any) {
      showToast(e.message || 'Could not save to Downloads', 'error');
    } finally {
      setDownloading(false);
    }
  }

  function openQuickAction(toolId: string) {
    setMenuVisible(false);
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return;
    navigation.navigate('ToolScreen', { tool, initialFile: { uri, name: fileName || 'document.pdf' } });
  }


  const quickTools = TOOLS.filter(t => QUICK_ACTION_IDS.includes(t.id));
  const canShowContent = !error && !needsPassword;

  return (
    <View style={styles.container}>
      {!fullscreen && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Icon name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={openJump} activeOpacity={pageInfo ? 0.6 : 1} disabled={!pageInfo}>
            <Text style={styles.title} numberOfLines={1}>{fileName || 'Preview'}</Text>
            {pageInfo && <Text style={styles.pageIndicator}>Page {pageInfo.page} of {pageInfo.total}</Text>}
          </TouchableOpacity>
          {canShowContent && (
            <TouchableOpacity style={styles.iconBtn} onPress={() => setMenuVisible(true)} activeOpacity={0.7}>
              <Icon name="ellipsis-vertical" size={18} color={theme.text} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {needsPassword ? (
        <View style={styles.center}>
          <Icon name="lock-closed-outline" size={40} color={theme.textMuted} />
          <Text style={styles.errorText}>This PDF is password protected</Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password"
            placeholderTextColor={theme.textMuted}
            value={passwordInput}
            onChangeText={setPasswordInput}
            secureTextEntry
            autoFocus
          />
          {passwordError && <Text style={styles.passwordError}>Incorrect password, try again</Text>}
          <TouchableOpacity style={styles.unlockBtn} onPress={submitPassword} activeOpacity={0.8}>
            <Text style={styles.unlockBtnText}>Unlock</Text>
          </TouchableOpacity>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Icon name="alert-circle-outline" size={40} color={theme.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <Pdf
          key={`${horizontal ? 'h' : 'v'}-${password || ''}`}
          ref={pdfRef}
          source={{ uri }}
          password={password}
          style={styles.pdf}
          fitPolicy={0}
          enablePaging
          horizontal={horizontal}
          // `scale` only changes here from the +/- buttons — it is intentionally NOT
          // synced from onScaleChanged, since re-applying a controlled scale prop on
          // every frame of a pinch gesture fights the gesture and makes it flicker.
          // Pinch-zoom still works natively; it just isn't mirrored back into state.
          scale={scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          onLoadComplete={(numberOfPages) => {
            hasLoadedRef.current = true;
            setPageInfo({ page: 1, total: numberOfPages });
            getLastPage(uri).then(saved => {
              if (saved && saved > 1 && saved <= numberOfPages) pdfRef.current?.setPage(saved);
            });
          }}
          onPageChanged={(page, numberOfPages) => {
            setPageInfo({ page, total: numberOfPages });
            setLastPage(uri, page);
          }}
          onPageSingleTap={() => setFullscreen(f => !f)}
          onError={handleError}
          renderActivityIndicator={() => <ActivityIndicator size="large" color={theme.accent} />}
        />
      )}

      {/* Go-to-page */}
      <Modal visible={jumpVisible} transparent animationType="fade" onRequestClose={() => setJumpVisible(false)}>
        <TouchableOpacity style={styles.centerOverlay} activeOpacity={1} onPress={() => setJumpVisible(false)}>
          <TouchableOpacity style={styles.jumpCard} activeOpacity={1}>
            <Text style={styles.jumpTitle}>Go to page</Text>
            <TextInput
              style={styles.jumpInput}
              value={jumpInput}
              onChangeText={setJumpInput}
              keyboardType="number-pad"
              autoFocus
              selectTextOnFocus
              placeholder={pageInfo ? `1 - ${pageInfo.total}` : ''}
              placeholderTextColor={theme.textMuted}
            />
            <View style={styles.jumpActions}>
              <TouchableOpacity style={styles.jumpBtnSecondary} onPress={() => setJumpVisible(false)} activeOpacity={0.7}>
                <Text style={styles.jumpBtnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.jumpBtnPrimary} onPress={submitJump} activeOpacity={0.8}>
                <Text style={styles.jumpBtnPrimaryText}>Go</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* More options — share, download, zoom, layout, quick tools */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <TouchableOpacity style={styles.sheet} activeOpacity={1}>
            <View style={styles.sheetHandle} />

            <TouchableOpacity style={styles.sheetRow} onPress={handleShare} activeOpacity={0.7}>
              <Icon name="share-outline" size={18} color={theme.textSoft} />
              <Text style={styles.sheetRowText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetRow} onPress={handleDownload} activeOpacity={0.7} disabled={downloading}>
              {downloading ? <ActivityIndicator size="small" color={theme.textSoft} /> : <Icon name="download-outline" size={18} color={theme.textSoft} />}
              <Text style={styles.sheetRowText}>Save to Downloads</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetRow} onPress={handlePrint} activeOpacity={0.7}>
              <Icon name="print-outline" size={18} color={theme.textSoft} />
              <Text style={styles.sheetRowText}>Print</Text>
            </TouchableOpacity>

            <View style={styles.sheetDivider} />

            <View style={styles.sheetRow}>
              <Icon name="search-outline" size={18} color={theme.textSoft} />
              <Text style={styles.sheetRowText}>Zoom</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={styles.zoomBtn} onPress={() => zoom(-ZOOM_STEP)} disabled={scale <= MIN_SCALE}>
                <Icon name="remove" size={16} color={scale <= MIN_SCALE ? theme.border : theme.text} />
              </TouchableOpacity>
              <Text style={styles.zoomLabel}>{Math.round(scale * 100)}%</Text>
              <TouchableOpacity style={styles.zoomBtn} onPress={() => zoom(ZOOM_STEP)} disabled={scale >= MAX_SCALE}>
                <Icon name="add" size={16} color={scale >= MAX_SCALE ? theme.border : theme.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sheetRow} onPress={() => setHorizontal(h => !h)} activeOpacity={0.7}>
              <Icon name={horizontal ? 'swap-horizontal-outline' : 'swap-vertical-outline'} size={18} color={theme.textSoft} />
              <Text style={styles.sheetRowText}>Scroll direction</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.sheetRowValue}>{horizontal ? 'Horizontal' : 'Vertical'}</Text>
            </TouchableOpacity>

            {quickTools.length > 0 && (
              <>
                <View style={styles.sheetDivider} />
                <Text style={styles.sheetSectionLabel}>Use this PDF with</Text>
                {quickTools.map(tool => (
                  <TouchableOpacity key={tool.id} style={styles.sheetRow} onPress={() => openQuickAction(tool.id)} activeOpacity={0.7}>
                    <Icon {...tool.icon} size={18} color={tool.color} />
                    <Text style={styles.sheetRowText}>{tool.name}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: theme.spacing.md, paddingTop: 48, paddingBottom: 14,
      borderBottomWidth: 1, borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    iconBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center',
    },
    title: { fontSize: theme.font.md, fontWeight: '700', color: theme.text },
    pageIndicator: { fontSize: theme.font.xs, color: theme.textMuted, marginTop: 2 },
    pdf: { flex: 1, width: '100%', backgroundColor: theme.bg },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
    errorText: { color: theme.textMuted, fontSize: theme.font.sm, textAlign: 'center' },
    passwordInput: {
      width: '100%', backgroundColor: theme.surface, borderRadius: theme.radius.md,
      padding: 14, color: theme.text, fontSize: theme.font.sm,
      borderWidth: 1, borderColor: theme.border, textAlign: 'center',
    },
    passwordError: { color: '#FF4D4D', fontSize: theme.font.xs },
    unlockBtn: {
      backgroundColor: theme.accent, borderRadius: theme.radius.lg,
      paddingVertical: 12, paddingHorizontal: 32,
    },
    unlockBtnText: { color: '#fff', fontWeight: '700', fontSize: theme.font.sm },

    centerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    jumpCard: {
      width: '100%', maxWidth: 320, backgroundColor: theme.surface, borderRadius: theme.radius.xl,
      padding: 20, borderWidth: 1, borderColor: theme.border,
    },
    jumpTitle: { fontSize: theme.font.md, fontWeight: '800', color: theme.text, marginBottom: 14 },
    jumpInput: {
      backgroundColor: theme.surface2, borderRadius: theme.radius.md,
      padding: 12, color: theme.text, fontSize: theme.font.md,
      borderWidth: 1, borderColor: theme.border, textAlign: 'center',
    },
    jumpActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
    jumpBtnSecondary: {
      flex: 1, paddingVertical: 12, borderRadius: theme.radius.md,
      alignItems: 'center', borderWidth: 1, borderColor: theme.border,
    },
    jumpBtnSecondaryText: { color: theme.textMuted, fontWeight: '600', fontSize: theme.font.sm },
    jumpBtnPrimary: {
      flex: 1, paddingVertical: 12, borderRadius: theme.radius.md,
      alignItems: 'center', backgroundColor: theme.accent,
    },
    jumpBtnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: theme.font.sm },

    sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: theme.surface, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl,
      paddingHorizontal: theme.spacing.md, paddingTop: 10, paddingBottom: 32,
      borderWidth: 1, borderColor: theme.border, borderBottomWidth: 0,
    },
    sheetHandle: {
      width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border,
      alignSelf: 'center', marginBottom: 12,
    },
    sheetRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingVertical: 13,
    },
    sheetRowText: { fontSize: theme.font.sm, color: theme.text, fontWeight: '600' },
    sheetRowValue: { fontSize: theme.font.sm, color: theme.textMuted },
    sheetDivider: { height: 1, backgroundColor: theme.border, marginVertical: 4 },
    sheetSectionLabel: {
      fontSize: theme.font.xs, color: theme.textMuted, fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8, marginBottom: 2,
    },
    zoomBtn: {
      width: 28, height: 28, borderRadius: 14,
      backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center',
    },
    zoomLabel: { fontSize: theme.font.xs, color: theme.textMuted, width: 40, textAlign: 'center' },
  });
}
