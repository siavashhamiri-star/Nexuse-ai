#!/bin/bash
# ==============================================================================
# MANA ECOSYSTEM - ANDROID APK & AAB GRADLE AUTOMATION BUILD SCRIPT
# ==============================================================================
# This script compiles the web frontend assets and prepares the Gradle project
# for building Release APK (for CafeBazaar & Myket) and Android App Bundle (.aab)
# for Google Play Store.
# ==============================================================================

set -e

echo "=========================================================="
echo "🚀 [1/4] Building Mana Web Production Assets (dist/)..."
echo "=========================================================="
npm run build

echo "=========================================================="
echo "📦 [2/4] Copying Web Assets to Android Asset Directory..."
echo "=========================================================="
mkdir -p android/app/src/main/assets/public
cp -r dist/* android/app/src/main/assets/public/

echo "=========================================================="
echo "🔧 [3/4] Ready for Gradle compilation:"
echo "   - To build APK for Bazaar / Myket: cd android && ./gradlew assembleRelease"
echo "   - To build AAB for Google Play:    cd android && ./gradlew bundleRelease"
echo "=========================================================="
echo "✅ Prerequisites & Gradle structures generated successfully!"
