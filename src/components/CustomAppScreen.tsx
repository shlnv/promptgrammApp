import { useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import * as React from "react";
import AppContext from "../context/AppContext.tsx";
import DeviceInfo from "react-native-device-info";

function CustomAppScreen({ route }: any) {
  const [code, setCode] = useState<null | string>(null);
  const [deviceModel, setDeviceModel] = useState<string>("");
  const webViewRef = useRef(null);

  useEffect(() => {
    const loadCode = async () => {
      const savedCode = await AsyncStorage.getItem("savedCode");
      if (savedCode) setCode(savedCode);
    };
    loadCode();
  }, []);

  const sendMessageToWebView = (message: string) => {
    if (webViewRef.current) {
      // @ts-ignore
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  };

  const handleMessageAndRespond = async (event: { nativeEvent: { data: any; }; }) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log(data);
    const type = data.type;
    switch (type) {
      case "DEVICE_MODEL": {
        console.log("case DEVICE_MODEL:");
        const deviceModel = DeviceInfo.getModel();
        const responseMessage = JSON.stringify({ response: deviceModel });
        sendMessageToWebView(responseMessage);
        if (webViewRef.current) {
          console.log("if webViewRef.current:");
          // @ts-ignore
          webViewRef.current.injectJavaScript(
            `window.receiveMessage(${responseMessage});`
          );
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    code ? (
      <WebView
        source={{ html: code }}
        ref={webViewRef}
        onMessage={handleMessageAndRespond}
        javaScriptEnabled={true}
        style={{ flex: 1 }}
      />
    ) : (
      <WebView
        onMessage={handleMessageAndRespond}
        ref={webViewRef}
        source={{
          html: `
            <html>
              <body>
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-size: 60px">
                  Your app will be here
                </div>
                <div>
                  <h1 id="deviceModel"></h1>
                </div>
                <button onclick="sendMessageToReactNative(event)">Show model</button>
                <script>
                  const sendMessageToReactNative = (event) => {
                    event.preventDefault();
                    window.ReactNativeWebView.postMessage(JSON.stringify({type: "DEVICE_MODEL"}));
                  }
                  window.receiveMessage = (message) => {
                    document.getElementById("deviceModel").innerHTML = JSON.parse(message).response;
                  }
                </script>
              </body>
            </html>`
        }}
        style={{ flex: 1 }}
      />
    )
  );
}

export default CustomAppScreen;
