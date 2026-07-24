import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, DefaultTheme, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { Theme } from '../theme';
import { ensurePreviewableUri } from '../utils/localFiles';

import { HomeScreen } from '../screens/Home';
import { FilesScreen } from '../screens/Files';
import { ToolsScreen } from '../screens/Tools';
import { ScannerScreen } from '../screens/Scanner';
import { SettingsScreen } from '../screens/Settings';
import { ToolScreen } from '../screens/Tool';
import { PdfViewerScreen } from '../screens/PdfViewer';
import { PdfPreviewScreen } from '../screens/PdfPreview';
import { SearchScreen } from '../screens/Search';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ITEMS = [
  { name: 'Home',    icon: 'home-outline',      iconActive: 'home',      label: 'Home'     },
  { name: 'Files',   icon: 'folder-outline',    iconActive: 'folder',    label: 'Files'    },
  { name: 'Tools',   icon: 'construct-outline', iconActive: 'construct', label: 'Tools'    },
  { name: 'Scanner', icon: 'camera-outline',    iconActive: 'camera',    label: 'Scan'     },
  { name: 'Settings',icon: 'settings-outline',  iconActive: 'settings',  label: 'Settings' },
] as const;

function TabBar({ state, descriptors, navigation }: any) {
  const theme = useTheme();
  const styles = makeTabBarStyles(theme);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const item = TAB_ITEMS[index];
        const scale = useRef(new Animated.Value(1)).current;

        function onPress() {
          Animated.sequence([
            Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
          ]).start();
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress} activeOpacity={1}>
            <Animated.View style={[styles.tabInner, isFocused && styles.tabInnerActive, { transform: [{ scale }] }]}>
              <Ionicons
                name={(isFocused ? item.iconActive : item.icon) as any}
                size={20}
                color={isFocused ? theme.accent : theme.textMuted}
              />
              {isFocused && <Text style={styles.tabLabel}>{item.label}</Text>}
            </Animated.View>
            {isFocused && <View style={styles.tabGlow} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Files" component={FilesScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// When a PDF is opened via "Open with FreeNoo" from a file manager, email app, etc.,
// Android delivers it as a VIEW intent whose data Linking surfaces as a content:// (or
// file://) URI — not our own "freenoo://" scheme. Route that straight to the preview
// screen instead of leaving it stranded on the home tab.
async function openIncomingPdf(navigationRef: any, url: string) {
  if (!url || url.startsWith('freenoo://') || url.startsWith('com.freenoo.app://')) return;
  const fileName = decodeURIComponent(url.split('/').pop() || '') || 'Shared PDF';
  try {
    const uri = await ensurePreviewableUri(url, fileName);
    navigationRef.navigate('PdfPreviewScreen', { uri, fileName });
  } catch {
    // Not a file we can read (e.g. a permission we don't hold) — silently ignore
    // rather than showing a confusing error for a link that isn't ours to handle.
  }
}

export function Navigation() {
  const theme = useTheme();
  const navigationRef = useNavigationContainerRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    Linking.getInitialURL().then(url => { if (url) openIncomingPdf(navigationRef, url); });
    const sub = Linking.addEventListener('url', ({ url }) => openIncomingPdf(navigationRef, url));
    return () => sub.remove();
  }, [isReady]);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.bg,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      primary: theme.accent,
      notification: theme.accent,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme} onReady={() => setIsReady(true)}>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}>
        <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="ToolScreen"
          component={ToolScreen as React.ComponentType<any>}
          options={({ route }: any) => ({
            title: route.params?.tool?.name || 'Tool',
            headerBackTitle: '',
          })}
        />
        <Stack.Screen
          name="PdfViewerScreen"
          component={PdfViewerScreen as React.ComponentType<any>}
          options={({ route }: any) => ({
            title: route.params?.tool?.name || 'PDF Viewer',
            headerBackTitle: '',
          })}
        />
        <Stack.Screen
          name="PdfPreviewScreen"
          component={PdfPreviewScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen as React.ComponentType<any>}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function makeTabBarStyles(theme: Theme) {
  return StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingBottom: 20,
      paddingTop: 10,
      paddingHorizontal: 8,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    tabInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: theme.radius.full,
    },
    tabInnerActive: {
      backgroundColor: theme.accentSoft,
      borderWidth: 1,
      borderColor: theme.accentGlow,
    },
    tabLabel: { fontSize: theme.font.xs, color: theme.accent, fontWeight: '700' },
    tabGlow: {
      position: 'absolute',
      bottom: -4,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.accent,
    },
  });
}
