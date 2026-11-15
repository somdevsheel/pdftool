# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# react-native-pdf: viewer library and the React Native bridge (no rules of their own;
# PDFium itself ships consumer rules for its JNI classes)
-keep class com.github.barteksc.pdfviewer.** { *; }
-keep class org.wonday.pdf.** { *; }
# react-native-blob-util: native module + response handlers
-keep class com.ReactNativeBlobUtil.** { *; }
-dontwarn org.apache.commons.lang3.**
