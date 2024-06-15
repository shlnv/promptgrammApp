// import DeviceInfo from "react-native-device-info";
// import { useContext } from "react";
// import AppContext from "../context/AppContext.tsx";
//
// const { webViewRef } = useContext(AppContext);
//
// const sendMessageToWebView = (message: string) => {
//   if (webViewRef && webViewRef.current) {
//     webViewRef.current.postMessage(JSON.stringify(message));
//   }
// };
//
// const handleMessageAndRespond = (event: { nativeEvent: { data: any; }; }) => {
//   const data = JSON.parse(event.nativeEvent.data);
//   console.log(data);
//   const type = data.type;
//   switch (type) {
//     case "DEVICE_MODEL": {
//       const deviceModel = DeviceInfo.getModel();
//       sendMessageToWebView(JSON.stringify({ response: deviceModel }));
//       // @ts-ignore
//       webViewRef.current.injectJavaScript(
//         // @ts-ignore
//         `window.receiveMessage("${responseMessage}");
//     `);
//     }
//     default:
//       break;
//   }
// };
//
// export default handleMessageAndRespond;
