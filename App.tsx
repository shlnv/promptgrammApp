import * as React from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import OpenAI from "openai";
import { CONTEXT, API_KEY } from "./consts.ts";

function CodeScreen({ navigation }: any) {
  const [code, setCode] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const openai = new OpenAI({ apiKey: API_KEY });

  const loadCode = async () => {
    const savedCode = await AsyncStorage.getItem("savedCode");
    if (savedCode) setCode(savedCode);
  };

  React.useEffect(() => {
    loadCode();
  }, []);

  const handleRunPrompt = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        temperature: 1,
        messages: [{ role: "system", content: CONTEXT }, { role: "user", content: prompt }],
        max_tokens: 4096
      });
      // @ts-ignore
      const receivedCode = response.choices[0].message.content.trim();
      await AsyncStorage.setItem("savedCode", receivedCode.startsWith("```html") ? receivedCode.substring(7, receivedCode.length - 3) : receivedCode);
      setCode(receivedCode);
    } catch (error) {
      // @ts-ignore
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput style={{ flex: 0.5, borderColor: "gray", borderWidth: 1, marginBottom: 10, padding: 10 }} multiline
                 placeholder="Enter your prompt..." onChangeText={setPrompt} value={prompt} />
      <Button title="Run Prompt" onPress={handleRunPrompt} />
      <TextInput style={{ flex: 1, borderColor: "gray", borderWidth: 1, marginTop: 10, padding: 10 }} multiline
                 placeholder="Write JavaScript code here..." onChangeText={setCode} value={code} />
      <Button title="Run Code" onPress={() => navigation.navigate("WebView")} />
    </View>
  );
}

function WebViewScreen() {
  const [code, setCode] = React.useState<null | string>(null);
  const handleMessage = (event: { nativeEvent: { data: any; }; }) => {
    // TODO: handle access to OS API
    const messageData = event.nativeEvent.data;
    Alert.alert('Message from WebView', messageData);
  };
  useFocusEffect(() => {
    const loadCode = async () => {
      const savedCode = await AsyncStorage.getItem("savedCode");
      if (savedCode) setCode(savedCode);
    };
    loadCode();
  });

  return code ? <WebView
      source={{ html: code }}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      style={{ flex: 1 }} /> :
    <WebView source={{ html: `<div>Your app will be here</div>` }} style={{ flex: 1 }} />;
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WebView">
        <Stack.Screen name="Code" component={CodeScreen} />
        <Stack.Screen name="WebView" component={WebViewScreen} options={({ navigation }) => ({
          title: "My Craft App",
          headerRight: () => <Button onPress={() => navigation.navigate("Code")} title="Edit Code" color="#000" />
        })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
