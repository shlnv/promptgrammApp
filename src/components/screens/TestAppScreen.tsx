import { WebView } from "react-native-webview";
import { useContext } from "react";
import { WebViewMessageContext } from "../providers/WebViewMessageProvider.tsx";

function TestAppScreen({ route }: any) {
  const {webViewRef, handleMessageAndRespond} = useContext(WebViewMessageContext);
  return <WebView
    ref={webViewRef}
    onMessage={handleMessageAndRespond}
    source={{
    html: `<html>
              <body>
                <div>
                  <h1 id="deviceModel"></h1>
                </div>
                <button onclick="sendMessageToReactNative(event)">Show model</button>
                <script>
                (function() {
      function intercept(method) {
        const original = console[method];
        console[method] = function(...args) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ method, args }));
          original.apply(console, args);
        };
      }
      intercept("log");
      intercept("warn");
      intercept("error");
    })();
    true;
                  const sendMessageToReactNative = (event) => {
                    event.preventDefault();
                    window.ReactNativeWebView.postMessage(JSON.stringify({type: "DEVICE_MODEL"}));
                  };
                  window.receiveMessage = (message) => {
                    console.log(message.response)
                    document.getElementById("deviceModel").innerHTML = message.response;
                  };
                </script>
              </body>
            </html>`
  }}
  style={{ flex: 1 }}
    />;
}

export default TestAppScreen;
