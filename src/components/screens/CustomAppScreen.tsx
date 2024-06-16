import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import { WebViewMessageContext } from "../providers/WebViewMessageProvider.tsx";

function CustomAppScreen({ route }: any) {
  const [code, setCode] = useState<null | string>(null);
  const {webViewRef, handleMessageAndRespond} = useContext(WebViewMessageContext);

  useEffect(() => {
    const loadCode = async () => {
      const savedCode = await AsyncStorage.getItem("savedCode");
      if (savedCode) setCode(savedCode);
    };
    loadCode();
  }, [route.params.codeStamp]);

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
        source={{
          html: `
            <html>
              <body>
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-size: 60px">
                  Your app will be here
                </div>
              </body>
            </html>`
        }}
        style={{ flex: 1 }}
      />
    )
  );
}

export default CustomAppScreen;
