import React, { ReactNode, useRef } from "react";
import AppContext from "./AppContext.tsx";
import { WebView } from "react-native-webview";

const ContextProvider = ({ children }: { children: ReactNode }) => {

  const webViewRef = useRef<WebView>(null);

  const contextValue = {
    webViewRef
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
export default ContextProvider;
