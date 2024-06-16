import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NewAppScreen from "./src/components/screens/NewAppScreen.tsx";
import CustomAppScreen from "./src/components/screens/CustomAppScreen.tsx";
import FeatureScreen from "./src/components/screens/FeatureScreen.tsx";
import SettingsScreen from "./src/components/screens/SettingsScreen.tsx";
import TestAppScreen from "./src/components/screens/TestAppScreen.tsx";
import OpenAI from "openai";
import { OPENAI_API_KEY as API_KEY } from "./secretKeys";
import { WebViewMessageProvider } from "./src/components/providers/WebViewMessageProvider.tsx";

export const openai = new OpenAI({ apiKey: API_KEY });
const Drawer = createDrawerNavigator();

function App() {
  return (
    <WebViewMessageProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="CustomAppScreen">
          <Drawer.Screen name="CustomAppScreen"
                         component={CustomAppScreen}
                         options={{ title: "Custom App" }} />
          <Drawer.Screen name="FeatureScreen"
                         component={FeatureScreen}
                         options={{ title: "Feature" }} />
          <Drawer.Screen name="NewAppScreen"
                         component={NewAppScreen}
                         options={{ title: "New App" }} />
          <Drawer.Screen name={"TestAppScreen"}
                         component={TestAppScreen}
                         options={{ title: "Test Screen" }} />
          <Drawer.Screen name="Settings"
                         component={SettingsScreen}
                         options={{ title: "Settings" }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </WebViewMessageProvider>
  );
}

export default App;
