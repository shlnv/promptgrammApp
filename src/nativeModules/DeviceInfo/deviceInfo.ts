import DeviceInfo from "react-native-device-info";

const getFullDeviceInfo = async () => {
  const deviceInfo = {
    uniqueId: await DeviceInfo.getUniqueId(),
    deviceId: DeviceInfo.getDeviceId(),
    model: DeviceInfo.getModel(),
    brand: DeviceInfo.getBrand(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    bundleId: DeviceInfo.getBundleId(),
    buildNumber: DeviceInfo.getBuildNumber(),
    appVersion: DeviceInfo.getVersion(),
    deviceName: await DeviceInfo.getDeviceName(),
    userAgent: await DeviceInfo.getUserAgent(),
    isEmulator: await DeviceInfo.isEmulator(),
    isTablet: DeviceInfo.isTablet(),
    isPinOrFingerprintSet: await DeviceInfo.isPinOrFingerprintSet()
  };

  return deviceInfo;
};

export default getFullDeviceInfo;
