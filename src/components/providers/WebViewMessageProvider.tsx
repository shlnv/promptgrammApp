import React, { createContext, ReactNode, RefObject, useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import DeviceInfo from "react-native-device-info";

interface WebViewMessageContextType {
  webViewRef: RefObject<WebView> | null;
  sendMessageToWebView: (message: string) => void;
  handleMessageAndRespond: (event: WebViewMessageEvent) => Promise<void>;
}

export const WebViewMessageContext = createContext<WebViewMessageContextType>({
  webViewRef: null,
  sendMessageToWebView: () => {
  },
  handleMessageAndRespond: async () => {
  }
});

export const WebViewMessageProvider = ({ children }: { children: ReactNode }) => {
  const webViewRef = useRef<WebView>(null);
  const sendMessageToWebView = (message: string) => {
    if (webViewRef && webViewRef.current) {
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
        console.log("device model: ", deviceModel);
        const responseMessage = JSON.stringify({ response: deviceModel });
        sendMessageToWebView(responseMessage);
        if (webViewRef && webViewRef.current) {
          console.log("if webViewRef.current:");
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

  const contextValue = {
    webViewRef,
    sendMessageToWebView,
    handleMessageAndRespond
  };

  return (
    <WebViewMessageContext.Provider value={contextValue}>
      {children}
    </WebViewMessageContext.Provider>
  );
};
