import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NewAppScreen from "./src/components/NewAppScreen.tsx"
import CustomAppScreen from "./src/components/CustomAppScreen.tsx";
import FeatureScreen from "./src/components/FeatureScreen.tsx";
import SettingsScreen from "./src/components/SettingsScreen.tsx";
import OpenAI from "openai";
const API_KEY = "sk-proj-niumTUNBEp76WfZe96bpT3BlbkFJnrxLBA05OQzTV6CkVMUS";
export const openai = new OpenAI({ apiKey: API_KEY });
const Drawer = createDrawerNavigator();

function App() {
  return (
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
        <Drawer.Screen name="Settings"
                       component={SettingsScreen}
                       options={{ title: "Settings" }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
