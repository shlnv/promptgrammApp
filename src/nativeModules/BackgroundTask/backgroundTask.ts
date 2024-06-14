import BackgroundFetch from "react-native-background-fetch";

class BackgroundTask {
  static configureBackgroundFetch() {
    BackgroundFetch.configure({
      minimumFetchInterval: 1, // minutes
      stopOnTerminate: true,
      startOnBoot: true
    }, async (taskId) => {
      console.log("[BackgroundFetch] Task start:", taskId);
      // My Task here
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("[BackgroundFetch] failed to start:", error);
    });
  }
}

export default BackgroundTask;
