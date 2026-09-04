# Proguard rules for Mana Ecosystem Android Release (APK & AAB)

-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
}

-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String);
}

# Preserve AndroidX and Google Material
-keep class com.google.android.material.** { *; }
-dontwarn com.google.android.material.**

# Preserve WebView interfaces and Bridge
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**
