import { createContext, RefObject } from "react";
import { WebView } from "react-native-webview";

interface AppContextType {
  webViewRef: RefObject<WebView> | null;
}

const AppContext = createContext<AppContextType>({
  webViewRef: null,
});

export default AppContext;
