import getFullDeviceInfo from "../nativeModules/DeviceInfo/deviceInfo.ts";

// @ts-ignore
const askOS = async ({ name }) => { //fix ts-ignore
  switch (name) {
    case "DEVICE_INFO":
      return await getFullDeviceInfo(); // write type of returned obj in typescript
    default:
      return;
  }
};
