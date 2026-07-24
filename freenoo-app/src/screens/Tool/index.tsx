import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, Animated, TextInput,
} from 'react-native';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { uploadFile, uploadMultipleFiles } from '../../api/services/upload.service';
import { createJob, pollJob } from '../../api/services/job.service';
import { ENDPOINTS } from '../../api/endpoints';
import { useAppStore } from '../../store';
import { ResultCard } from '../../components/tool/ResultCard';
import { Icon } from '../../components/common/Icon';
import { isPdf, ensurePreviewableUri } from '../../utils/localFiles';
import { Tool } from '../../types';

type PickedFile = { uri: string; name: string; mimeType?: string };

interface Props { navigation: any; route: { params: { tool: Tool; initialFile?: PickedFile } }; }

// Parses "1,3,5-7" into [1,3,5,6,7], ignoring invalid entries.
function parsePageList(input: string): number[] {
  const result = new Set<number>();
  for (const part of input.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      for (let p = Math.min(start, end); p <= Math.max(start, end); p++) result.add(p);
    } else if (/^\d+$/.test(trimmed)) {
      result.add(parseInt(trimmed, 10));
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

export function ToolScreen({ navigation, route }: Props) {
  const { tool, initialFile } = route.params;
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { setProcessing, setProgress, showToast } = useAppStore();

  const [files, setFiles] = useState<PickedFile[]>(initialFile ? [initialFile] : []);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Tool-specific defaults
  const [quality, setQuality] = useState<'low'|'medium'|'high'>('medium');
  const [degrees, setDegrees] = useState<90|180|270>(90);
  const [password, setPassword] = useState('');
  const [format, setFormat] = useState<'docx'|'pptx'|'xlsx'>(
    (['docx','pptx','xlsx'] as const).includes(tool.outputExt as any) ? (tool.outputExt as 'docx'|'pptx'|'xlsx') : 'docx'
  );
  const [pages, setPages] = useState('');

  // Crop margins (points, 72pt = 1 inch)
  const [cropTop, setCropTop] = useState('36');
  const [cropBottom, setCropBottom] = useState('36');
  const [cropLeft, setCropLeft] = useState('36');
  const [cropRight, setCropRight] = useState('36');

  // Insert pages
  const [afterPage, setAfterPage] = useState('0');

  // Organize pages
  const [operation, setOperation] = useState<'delete'|'extract'>('delete');
  const [pageList, setPageList] = useState('');

  const scale = useRef(new Animated.Value(1)).current;

  async function pickFiles() {
    const isImage = tool.inputType === 'multi-image';
    const isMulti = tool.inputType === 'multi-pdf' || tool.inputType === 'multi-image';
    // Insert Pages needs exactly two distinct files (base, then insert) picked one at a time.
    const isInsert = tool.id === 'insert';

    const result = await DocumentPicker.getDocumentAsync({
      type: isImage ? ['image/jpeg', 'image/png', 'image/tiff'] : 'application/pdf',
      multiple: isMulti && !isInsert,
    });

    if (!result.canceled) {
      const picked = result.assets.map(a => ({ uri: a.uri, name: a.name, mimeType: a.mimeType || undefined }));
      if (isMulti) {
        setFiles(prev => isInsert ? [...prev, ...picked].slice(0, 2) : [...prev, ...picked]);
      } else {
        setFiles(picked);
      }
    }
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function openPreview(file: PickedFile) {
    try {
      const uri = await ensurePreviewableUri(file.uri, file.name);
      navigation.navigate('PdfPreviewScreen', { uri, fileName: file.name });
    } catch (e: any) {
      showToast(e.message || 'Could not open this PDF', 'error');
    }
  }

  // Swaps a file with its neighbor — the reorder mechanism for multi-file tools
  // like Merge, where output order follows the list order.
  function moveFile(index: number, direction: -1 | 1) {
    setFiles(prev => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleProcess() {
    if (files.length === 0) {
      Alert.alert('No file selected', 'Please select a file to process.');
      return;
    }
    if (tool.id === 'protect' && !password) {
      Alert.alert('Password required', 'Please enter a password.');
      return;
    }
    if (tool.id === 'insert' && files.length < 2) {
      Alert.alert('Two files required', 'Please select both the base PDF and the PDF to insert.');
      return;
    }
    const parsedPages = tool.id === 'organize' ? parsePageList(pageList) : [];
    if (tool.id === 'organize' && parsedPages.length === 0) {
      Alert.alert('Page numbers required', 'Please enter at least one page number, e.g. 1,3,5');
      return;
    }

    setProcessing(true, `Processing ${tool.name}...`);
    try {
      let body: Record<string, any> = {};

      if (tool.id === 'insert') {
        const ids = await uploadMultipleFiles(files, (cur, total) => {
          setProgress(Math.round((cur / total) * 40));
          useAppStore.getState().setProcessing(true, `Uploading ${cur}/${total}...`);
        });
        body.baseFileId = ids[0];
        body.insertFileId = ids[1];
        body.afterPage = parseInt(afterPage, 10) || 0;
      } else if (tool.inputType === 'multi-pdf' || tool.inputType === 'multi-image') {
        const ids = await uploadMultipleFiles(files, (cur, total) => {
          setProgress(Math.round((cur / total) * 40));
          useAppStore.getState().setProcessing(true, `Uploading ${cur}/${total}...`);
        });
        body.fileIds = ids;
      } else {
        useAppStore.getState().setProcessing(true, 'Uploading file...');
        const id = await uploadFile(files[0].uri, files[0].name, files[0].mimeType);
        body.fileId = id;
      }

      // Add tool-specific params
      if (tool.id === 'compress') body.quality = quality;
      if (tool.id === 'rotate') body.degrees = degrees;
      if (tool.id === 'protect') body.userPassword = password;
      if (tool.id === 'split' && pages) body.pages = pages;
      if (['pdf-to-word','pdf-to-ppt','pdf-to-excel'].includes(tool.id)) body.format = format;
      if (tool.id === 'crop') {
        body.top = parseInt(cropTop, 10) || 0;
        body.bottom = parseInt(cropBottom, 10) || 0;
        body.left = parseInt(cropLeft, 10) || 0;
        body.right = parseInt(cropRight, 10) || 0;
      }
      if (tool.id === 'organize') {
        body.operation = operation;
        body.pages = parsedPages;
      }

      useAppStore.getState().setProcessing(true, 'Processing...');
      setProgress(50);

      const jobId = await createJob(tool.endpoint, body);

      await pollJob(jobId, 60, (p) => {
        setProgress(50 + Math.round(p * 0.5));
      });

      setDownloadUrl(ENDPOINTS.download(jobId));
      showToast('File processed successfully!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Something went wrong', 'error');
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setFiles([]); setDownloadUrl(null); setPassword(''); setPages('');
    setCropTop('36'); setCropBottom('36'); setCropLeft('36'); setCropRight('36');
    setAfterPage('0'); setOperation('delete'); setPageList('');
  }

  const isMulti = tool.inputType === 'multi-pdf' || tool.inputType === 'multi-image';
  const fileIconName = tool.inputType === 'multi-image' ? 'image-outline' : 'document-text-outline';
  // Insert's two files have fixed roles (base/insert), so reordering doesn't apply there.
  const canReorder = isMulti && tool.id !== 'insert';

  function renderFileRow(file: PickedFile, i: number, drag?: () => void, isActive?: boolean) {
    return (
      <View key={i} style={[styles.fileRow, isActive && styles.fileRowActive]}>
        {canReorder && (
          <View style={styles.orderBadge}>
            <Text style={styles.orderBadgeText}>{i + 1}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.fileRowMain}
          onPress={() => isPdf(file.name) && openPreview(file)}
          activeOpacity={isPdf(file.name) ? 0.6 : 1}
        >
          <Icon name={fileIconName} size={18} color={theme.textSoft} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            {tool.id === 'insert' && (
              <Text style={styles.fileRowTag}>{i === 0 ? 'BASE PDF' : 'INSERT PDF'}</Text>
            )}
            <Text style={styles.fileRowName} numberOfLines={1}>{file.name}</Text>
          </View>
          {isPdf(file.name) && <Icon name="eye-outline" size={16} color={theme.textMuted} />}
        </TouchableOpacity>
        {canReorder && (
          <>
            {/* Dedicated drag handle — a separate touch target from the preview
                tap above, so the two gestures never compete for the same touch. */}
            <TouchableOpacity
              onPressIn={drag}
              disabled={isActive}
              style={styles.dragHandle}
              hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            >
              <Icon name="reorder-three-outline" size={18} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => moveFile(i, -1)}
              disabled={i === 0}
              style={[styles.reorderBtn, i === 0 && styles.reorderBtnDisabled]}
            >
              <Icon name="chevron-up-outline" size={16} color={i === 0 ? theme.border : theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => moveFile(i, 1)}
              disabled={i === files.length - 1}
              style={[styles.reorderBtn, i === files.length - 1 && styles.reorderBtnDisabled]}
            >
              <Icon name="chevron-down-outline" size={16} color={i === files.length - 1 ? theme.border : theme.textMuted} />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={() => removeFile(i)} style={styles.removeBtn}>
          <Icon name="close" size={16} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NestableScrollContainer contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Tool Header */}
        <View style={styles.toolHeader}>
          <View style={[styles.toolIconBox, { backgroundColor: tool.color + '22' }]}>
            <Icon {...tool.icon} size={26} color={tool.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.toolName}>{tool.name}</Text>
            <Text style={styles.toolDesc}>{tool.desc}</Text>
          </View>
        </View>

        {!downloadUrl ? (
          <>
            {/* File List */}
            {canReorder ? (
              <NestableDraggableFlatList
                data={files}
                keyExtractor={(item, index) => item.uri + index}
                renderItem={({ item, getIndex, drag, isActive }) => (
                  <ScaleDecorator>
                    {renderFileRow(item, getIndex() ?? 0, drag, isActive)}
                  </ScaleDecorator>
                )}
                onDragEnd={({ data }) => setFiles(data)}
                activationDistance={10}
              />
            ) : (
              files.map((file, i) => renderFileRow(file, i))
            )}

            {/* Pick Button */}
            {tool.id === 'insert' ? (
              files.length < 2 && (
                <TouchableOpacity style={styles.pickBtn} onPress={pickFiles} activeOpacity={0.7}>
                  <View style={styles.pickBtnInner}>
                    <Text style={styles.pickBtnPlus}>+</Text>
                    <Text style={styles.pickBtnText}>
                      {files.length === 0 ? 'Select Base PDF' : 'Select PDF to Insert'}
                    </Text>
                  </View>
                  <Text style={styles.pickBtnSub}>Tap to browse files</Text>
                </TouchableOpacity>
              )
            ) : (isMulti || files.length === 0) && (
              <TouchableOpacity style={styles.pickBtn} onPress={pickFiles} activeOpacity={0.7}>
                <View style={styles.pickBtnInner}>
                  <Text style={styles.pickBtnPlus}>+</Text>
                  <Text style={styles.pickBtnText}>
                    {tool.inputType === 'multi-image' ? 'Add Images' : files.length > 0 ? 'Add More PDFs' : 'Select PDF File'}
                  </Text>
                </View>
                <Text style={styles.pickBtnSub}>Tap to browse files</Text>
              </TouchableOpacity>
            )}

            {/* Tool-specific options */}
            {files.length > 0 && (
              <View style={styles.options}>

                {/* Compress quality */}
                {tool.id === 'compress' && (
                  <View>
                    <Text style={styles.optLabel}>Compression Level</Text>
                    <View style={styles.optRow}>
                      {(['low','medium','high'] as const).map(q => (
                        <TouchableOpacity
                          key={q} style={[styles.optBtn, quality === q && styles.optBtnActive]}
                          onPress={() => setQuality(q)} activeOpacity={0.7}>
                          <Text style={[styles.optBtnText, quality === q && styles.optBtnTextActive]}>
                            {q.charAt(0).toUpperCase() + q.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Rotate degrees */}
                {tool.id === 'rotate' && (
                  <View>
                    <Text style={styles.optLabel}>Rotation Angle</Text>
                    <View style={styles.optRow}>
                      {([90,180,270] as const).map(d => (
                        <TouchableOpacity
                          key={d} style={[styles.optBtn, degrees === d && styles.optBtnActive]}
                          onPress={() => setDegrees(d)} activeOpacity={0.7}>
                          <Text style={[styles.optBtnText, degrees === d && styles.optBtnTextActive]}>{d}°</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Protect password */}
                {tool.id === 'protect' && (
                  <View>
                    <Text style={styles.optLabel}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter password"
                      placeholderTextColor={theme.textMuted}
                      value={password} onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                )}

                {/* Split pages */}
                {tool.id === 'split' && (
                  <View>
                    <Text style={styles.optLabel}>Page Ranges (optional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 1-3, 5, 7-9"
                      placeholderTextColor={theme.textMuted}
                      value={pages} onChangeText={setPages}
                    />
                    <Text style={styles.optHint}>Leave empty to split all pages</Text>
                  </View>
                )}

                {/* PDF to Office format */}
                {['pdf-to-word','pdf-to-ppt','pdf-to-excel'].includes(tool.id) && (
                  <View>
                    <Text style={styles.optLabel}>Output Format</Text>
                    <View style={styles.optRow}>
                      {(['docx','pptx','xlsx'] as const).map(f => (
                        <TouchableOpacity
                          key={f} style={[styles.optBtn, format === f && styles.optBtnActive]}
                          onPress={() => setFormat(f)} activeOpacity={0.7}>
                          <Text style={[styles.optBtnText, format === f && styles.optBtnTextActive]}>{f.toUpperCase()}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Crop margins */}
                {tool.id === 'crop' && (
                  <View>
                    <Text style={styles.optLabel}>Margins to remove (points, 72pt = 1 inch)</Text>
                    <View style={styles.cropGrid}>
                      <View style={styles.cropRow}>
                        <Text style={styles.optHint}>Top</Text>
                        <TextInput style={styles.cropInput} keyboardType="number-pad" value={cropTop} onChangeText={setCropTop} placeholderTextColor={theme.textMuted} />
                      </View>
                      <View style={styles.cropRow}>
                        <Text style={styles.optHint}>Bottom</Text>
                        <TextInput style={styles.cropInput} keyboardType="number-pad" value={cropBottom} onChangeText={setCropBottom} placeholderTextColor={theme.textMuted} />
                      </View>
                      <View style={styles.cropRow}>
                        <Text style={styles.optHint}>Left</Text>
                        <TextInput style={styles.cropInput} keyboardType="number-pad" value={cropLeft} onChangeText={setCropLeft} placeholderTextColor={theme.textMuted} />
                      </View>
                      <View style={styles.cropRow}>
                        <Text style={styles.optHint}>Right</Text>
                        <TextInput style={styles.cropInput} keyboardType="number-pad" value={cropRight} onChangeText={setCropRight} placeholderTextColor={theme.textMuted} />
                      </View>
                    </View>
                  </View>
                )}

                {/* Insert pages position */}
                {tool.id === 'insert' && files.length === 2 && (
                  <View>
                    <Text style={styles.optLabel}>Insert after page</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0 = prepend at beginning"
                      placeholderTextColor={theme.textMuted}
                      keyboardType="number-pad"
                      value={afterPage} onChangeText={setAfterPage}
                    />
                    <Text style={styles.optHint}>Enter 0 to prepend at the beginning</Text>
                  </View>
                )}

                {/* Organize pages */}
                {tool.id === 'organize' && (
                  <View>
                    <Text style={styles.optLabel}>Operation</Text>
                    <View style={styles.optRow}>
                      {(['delete','extract'] as const).map(op => (
                        <TouchableOpacity
                          key={op} style={[styles.optBtn, operation === op && styles.optBtnActive]}
                          onPress={() => setOperation(op)} activeOpacity={0.7}>
                          <Text style={[styles.optBtnText, operation === op && styles.optBtnTextActive]}>
                            {op.charAt(0).toUpperCase() + op.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text style={styles.optLabel}>Page numbers</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 1,3,5-7"
                      placeholderTextColor={theme.textMuted}
                      value={pageList} onChangeText={setPageList}
                    />
                    <Text style={styles.optHint}>
                      {operation === 'delete' ? 'These pages will be removed' : 'Only these pages will be kept'}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Button */}
            {(tool.id === 'insert' ? files.length === 2 : files.length > 0) && (
              <TouchableOpacity style={styles.actionBtn} onPress={handleProcess} activeOpacity={0.8}>
                <Text style={styles.actionBtnText}>{tool.name} →</Text>
              </TouchableOpacity>
            )}

            {/* Info */}
            <View style={styles.infoRow}>
              <View style={styles.infoItemRow}>
                <Icon name="lock-closed-outline" size={12} color={theme.textMuted} />
                <Text style={styles.infoItem}>Secure</Text>
              </View>
              <View style={styles.infoItemRow}>
                <Icon name="time-outline" size={12} color={theme.textMuted} />
                <Text style={styles.infoItem}>60min auto-delete</Text>
              </View>
              <View style={styles.infoItemRow}>
                <Icon name="person-outline" size={12} color={theme.textMuted} />
                <Text style={styles.infoItem}>Anonymous</Text>
              </View>
            </View>
          </>
        ) : (
          <ResultCard
            downloadUrl={downloadUrl}
            fileName={`freenoo-${tool.id}.${tool.outputExt}`}
            onReset={reset}
            navigation={navigation}
          />
        )}
      </NestableScrollContainer>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    content: { padding: theme.spacing.md, paddingBottom: 100 },
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
    fileRow: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: theme.surface, borderRadius: theme.radius.md,
      padding: 14, marginBottom: 8,
      borderWidth: 1, borderColor: theme.border,
    },
    fileRowActive: {
      borderColor: theme.accent, backgroundColor: theme.surface2,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
    },
    fileRowMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    fileRowName: { fontSize: theme.font.sm, color: theme.text },
    fileRowTag: { fontSize: theme.font.xs, color: theme.accent, fontWeight: '700', marginBottom: 2 },
    orderBadge: {
      width: 20, height: 20, borderRadius: 10,
      backgroundColor: theme.accentSoft, alignItems: 'center', justifyContent: 'center',
    },
    orderBadgeText: { fontSize: theme.font.xs, color: theme.accent, fontWeight: '700' },
    dragHandle: { padding: 4 },
    reorderBtn: { padding: 4 },
    reorderBtnDisabled: { opacity: 0.3 },
    removeBtn: { padding: 4 },
    pickBtn: {
      backgroundColor: theme.surface, borderRadius: theme.radius.lg,
      padding: 24, borderWidth: 2, borderColor: theme.border,
      borderStyle: 'dashed', marginBottom: 16, alignItems: 'center',
    },
    pickBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    pickBtnPlus: { fontSize: 28, color: theme.accent, fontWeight: '300' },
    pickBtnText: { fontSize: theme.font.md, color: theme.text, fontWeight: '600' },
    pickBtnSub: { fontSize: theme.font.xs, color: theme.textMuted },
    options: { marginBottom: 16 },
    optLabel: { fontSize: theme.font.sm, color: theme.textMuted, marginBottom: 10, marginTop: 8 },
    optRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    optBtn: {
      flex: 1, padding: 12, borderRadius: theme.radius.md,
      backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
      alignItems: 'center',
    },
    optBtnActive: { backgroundColor: theme.accent, borderColor: theme.accent },
    optBtnText: { fontSize: theme.font.sm, color: theme.textMuted, fontWeight: '600' },
    optBtnTextActive: { color: '#fff' },
    input: {
      backgroundColor: theme.surface, borderRadius: theme.radius.md,
      padding: 14, color: theme.text, fontSize: theme.font.sm,
      borderWidth: 1, borderColor: theme.border, marginBottom: 4,
    },
    optHint: { fontSize: theme.font.xs, color: theme.textMuted },
    cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    cropRow: { width: '47%', gap: 6 },
    cropInput: {
      backgroundColor: theme.surface, borderRadius: theme.radius.md,
      padding: 12, color: theme.text, fontSize: theme.font.sm,
      borderWidth: 1, borderColor: theme.border, textAlign: 'center',
    },
    actionBtn: {
      backgroundColor: theme.accent, borderRadius: theme.radius.lg,
      padding: 18, alignItems: 'center', marginBottom: 16,
    },
    actionBtnText: { color: '#fff', fontWeight: '800', fontSize: theme.font.md },
    infoRow: {
      flexDirection: 'row', justifyContent: 'center', gap: 16,
      paddingTop: 8,
    },
    infoItemRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    infoItem: { fontSize: theme.font.xs, color: theme.textMuted },
  });
}
