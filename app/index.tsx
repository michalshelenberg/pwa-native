import Constants from "expo-constants";
import { SplashScreen } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Platform, SafeAreaView } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";

const BACKGROUND_COLOR = "#FFFFFF";
const ANDROID_BAR_HEIGHT =
  Platform.OS === "android" ? Constants.statusBarHeight : 0;

export default function App() {
  const WEBVIEW = useRef<WebView>(null);

  const [backButtonEnabled, setBackButtonEnabled] = useState(false);

  // Webview navigation state change
  function onNavigationStateChange(navState: WebViewNavigation) {
    setBackButtonEnabled(navState.canGoBack);
  }

  async function webViewLoaded() {
    await SplashScreen.hideAsync();
  }

  useEffect(() => {
    // Handle back event
    function backHandler() {
      if (backButtonEnabled && WEBVIEW.current) {
        WEBVIEW.current.goBack();
        return true;
      }
    }

    // Subscribe to back state vent
    BackHandler.addEventListener("hardwareBackPress", backHandler);

    // Unsubscribe
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
  }, [backButtonEnabled]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
      }}
    >
      <WebView
        onLoad={webViewLoaded}
        ref={WEBVIEW}
        onNavigationStateChange={onNavigationStateChange}
        source={{ uri: "https://expo.io/" }}
      />
    </SafeAreaView>
  );
}
