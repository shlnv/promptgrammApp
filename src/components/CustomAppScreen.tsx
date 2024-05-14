import { useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import * as React from "react";

function CustomAppScreen({ route }: any) {
  const [code, setCode] = useState<null | string>(null);
  const handleMessage = (event: { nativeEvent: { data: any; }; }) => {
    // TODO: handle access to OS API
    const messageData = event.nativeEvent.data;
    Alert.alert("Message from WebView", messageData);
  };
  useEffect(() => {
    const loadCode = async () => {
      const savedCode = await AsyncStorage.getItem("savedCode");
      if (savedCode) setCode(savedCode);
    };
    loadCode();
  });

  return code ? <WebView
      source={{ html: code }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      style={{ flex: 1 }} /> :
    <WebView
      source={{
        html: `<html><body><div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-size: 60px">Your app will be here</div></body></html>`
      }}
      style={{ flex: 1 }} />;
}

export default CustomAppScreen;
