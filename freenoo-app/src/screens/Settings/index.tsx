import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Theme } from '../../theme';
import { useAppStore } from '../../store';
import { Icon, IconSpec } from '../../components/common/Icon';
import { Header } from '../../components/layout/Header';
import { listLocalFiles, clearLocalFiles, formatFileSize } from '../../utils/localFiles';

const PRIVACY_URL = 'https://freenoo.com/privacy';
const TERMS_URL = 'https://freenoo.com/terms';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.freenoo.app';

interface SettingItem {
  id: string;
  icon: IconSpec;
  label: string;
  sub: string;
  accent?: boolean;
  toggle?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

// Pro tier isn't built yet — hide its entry points until it ships, without ripping out
// the (already-wired) handlers so re-enabling later is just flipping this flag.
const SHOW_PRO_UPGRADE = false;

const SETTINGS_SECTIONS: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Account',
    items: [
      { id: 'profile', icon: { name: 'person-outline' }, label: 'Profile', sub: 'Anonymous user' },
      ...(SHOW_PRO_UPGRADE ? [{ id: 'upgrade', icon: { name: 'star-outline' }, label: 'Upgrade to Pro', sub: 'Unlock all features', accent: true }] : []),
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'darkMode', icon: { name: 'moon-outline' }, label: 'Dark Mode', sub: '', toggle: true },
      { id: 'notifications', icon: { name: 'notifications-outline' }, label: 'Notifications', sub: 'Processing updates', toggle: true },
    ],
  },
  {
    title: 'Storage',
    items: [
      { id: 'clearFiles', icon: { name: 'trash-outline' }, label: 'Clear Saved Files', sub: 'Remove files saved on this device', danger: true },
      { id: 'dataUsage', icon: { name: 'bar-chart-outline' }, label: 'Data Usage', sub: 'Calculating…', disabled: true },
    ],
  },
  {
    title: 'About',
    items: [
      { id: 'appVersion', icon: { name: 'phone-portrait-outline' }, label: 'App Version', sub: '1.0.0', disabled: true },
      { id: 'privacy', icon: { name: 'lock-closed-outline' }, label: 'Privacy Policy', sub: 'freenoo.com/privacy' },
      { id: 'terms', icon: { name: 'document-text-outline' }, label: 'Terms of Service', sub: 'freenoo.com/terms' },
      { id: 'rateApp', icon: { name: 'star-outline' }, label: 'Rate App', sub: 'Help us improve' },
    ],
  },
];

export function SettingsScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const notificationsEnabled = useAppStore(s => s.notificationsEnabled);
  const setNotificationsEnabled = useAppStore(s => s.setNotificationsEnabled);
  const themeMode = useAppStore(s => s.themeMode);
  const setThemeMode = useAppStore(s => s.setThemeMode);
  const [dataUsageLabel, setDataUsageLabel] = useState('Calculating…');

  async function computeDataUsage() {
    try {
      const files = await listLocalFiles();
      const total = files.reduce((sum, f) => sum + f.size, 0);
      setDataUsageLabel(total === 0 ? '0 MB used' : `${formatFileSize(total)} used`);
    } catch {
      setDataUsageLabel('Unavailable');
    }
  }

  useEffect(() => { computeDataUsage(); }, []);

  function handleClearFiles() {
    Alert.alert('Clear Saved Files', 'This deletes files FreeNoo has saved to your device (visible in the Files tab). Files still being processed are unaffected.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive', onPress: async () => {
          try {
            await clearLocalFiles();
          } finally {
            computeDataUsage();
          }
        },
      },
    ]);
  }

  function handlePress(item: SettingItem) {
    switch (item.id) {
      case 'profile':
        Alert.alert('Anonymous Session', 'FreeNoo doesn’t require an account. Files you process are handled anonymously and deleted automatically within 60 minutes.');
        return;
      case 'upgrade':
        Alert.alert('Coming Soon', 'FreeNoo Pro will be available in a future update.');
        return;
      case 'clearFiles':
        handleClearFiles();
        return;
      case 'privacy':
        Linking.openURL(PRIVACY_URL);
        return;
      case 'terms':
        Linking.openURL(TERMS_URL);
        return;
      case 'rateApp':
        Linking.openURL(PLAY_STORE_URL);
        return;
      default:
        return;
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Settings" showMenu={false} showSearch={false} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Premium Banner */}
        {SHOW_PRO_UPGRADE && (
          <View style={styles.premiumCard}>
            <View style={styles.premiumLeft}>
              <Icon name="crown" family="mci" size={28} color={theme.accent} />
              <View>
                <Text style={styles.premiumTitle}>FreeNoo Pro</Text>
                <Text style={styles.premiumSub}>Unlimited tools · Priority processing</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.premiumBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Coming Soon', 'FreeNoo Pro will be available in a future update.')}
            >
              <Text style={styles.premiumBtnText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => {
                const sub = item.id === 'dataUsage' ? dataUsageLabel
                  : item.id === 'darkMode' ? (themeMode === 'dark' ? 'Dark' : 'Light (yellowish white)')
                  : item.sub;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.settingRow, i < section.items.length - 1 && styles.settingRowBorder]}
                    onPress={item.disabled ? undefined : () => handlePress(item)}
                    disabled={item.disabled}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.settingIcon, item.accent && styles.settingIconAccent]}>
                      <Icon
                        {...item.icon}
                        size={18}
                        color={item.danger ? '#FF4D4D' : item.accent ? theme.accent : theme.textSoft}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.settingLabel, item.danger && styles.settingLabelDanger, item.accent && styles.settingLabelAccent]}>
                        {item.label}
                      </Text>
                      <Text style={styles.settingSub}>{sub}</Text>
                    </View>
                    {item.id === 'darkMode' ? (
                      <Switch
                        value={themeMode === 'dark'}
                        onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
                        thumbColor="#fff"
                        trackColor={{ true: theme.accent }}
                      />
                    ) : item.id === 'notifications' ? (
                      <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        thumbColor="#fff"
                        trackColor={{ true: theme.accent }}
                      />
                    ) : item.disabled ? null : (
                      <Icon name="chevron-forward-outline" size={18} color={theme.textMuted} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>FreeNoo · Free PDF Tools</Text>
          <Text style={styles.footerSub}>Made with ❤️ in India</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.bg },
    premiumCard: {
      margin: theme.spacing.md,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: theme.accentSoft, borderRadius: theme.radius.xl,
      padding: 16, borderWidth: 1, borderColor: theme.accentGlow,
    },
    premiumLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    premiumTitle: { fontSize: theme.font.md, fontWeight: '800', color: theme.text },
    premiumSub: { fontSize: theme.font.xs, color: theme.textSoft },
    premiumBtn: { backgroundColor: theme.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: theme.radius.full },
    premiumBtnText: { color: '#fff', fontWeight: '700', fontSize: theme.font.sm },
    section: { paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
    sectionTitle: { fontSize: theme.font.sm, color: theme.textMuted, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    sectionCard: { backgroundColor: theme.surface, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
    settingRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
    settingRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.border },
    settingIcon: { width: 36, height: 36, borderRadius: theme.radius.md, backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center' },
    settingIconAccent: { backgroundColor: theme.accentSoft },
    settingLabel: { fontSize: theme.font.sm, color: theme.text, fontWeight: '600', marginBottom: 2 },
    settingLabelDanger: { color: '#FF4D4D' },
    settingLabelAccent: { color: theme.accent },
    settingSub: { fontSize: theme.font.xs, color: theme.textMuted },
    footer: { alignItems: 'center', padding: theme.spacing.xl },
    footerText: { fontSize: theme.font.sm, color: theme.textMuted, fontWeight: '600' },
    footerSub: { fontSize: theme.font.xs, color: theme.textMuted, marginTop: 4 },
  });
}
