import * as React from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OpenAI from "openai";

// Screen for Writing JavaScript Code
// @ts-ignore
function CodeScreen({ navigation }) {
  const [code, setCode] = React.useState("");
  const [prompt, setPrompt] = React.useState("");
  const openai = new OpenAI({ apiKey: "sk-proj-niumTUNBEp76WfZe96bpT3BlbkFJnrxLBA05OQzTV6CkVMUS" });
  const context = "You are a HTML code translator. Your role is to translate natural language to HTML. Your only output should be HTML-code. Do not include any other text. Inside HTML-code can only exist css code in tag style and javascript code in tag script. All code that you will generate will be executed in the webView component in mobile application. If you need to save any data then save it to the local storage.";

  React.useEffect(() => {
    const loadCode = async () => {
      const savedCode = await AsyncStorage.getItem("savedCode");
      if (savedCode) {
        setCode(savedCode);
      }
    };
    loadCode();
  }, []);

  function trimString(str: string) {
    if (str.length > 10) {
      return str.substring(7, str.length - 3);
    } else {
      return "";
    }
  }

  const handleRunPrompt = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        temperature: 0,
        messages: [
          {
            "role": "system",
            "content": context
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 4000
      });
      // @ts-ignore
      const trimmedCode = response.choices[0].message.content.trim();
      // @ts-ignore
      setCode(trimString(trimmedCode));
      await AsyncStorage.setItem("savedCode", trimmedCode);
    } catch (error) {
      // @ts-ignore
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{
          flex: 0.5,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 10
        }}
        multiline
        placeholder="Enter your prompt for OpenAI..."
        onChangeText={setPrompt}
        value={prompt}
      />
      <Button title="Run Prompt" onPress={handleRunPrompt} />
      <TextInput
        style={{
          flex: 1,
          borderColor: "gray",
          borderWidth: 1,
          marginTop: 10,
          padding: 10
        }}
        multiline
        placeholder="Write JavaScript code here..."
        onChangeText={setCode}
        value={code}
      />
      <Button
        title="Run Code"
        onPress={() => navigation.navigate("WebView", { code })}
      />
    </View>
  );
}

// @ts-ignore
function WebViewScreen({ route }) {
  if (!route.params) {
    const emptyHTML = `<div>Tap to menu to generate any app you want</div>`;
    // @ts-ignore
    return <WebView source={{ emptyHTML }} style={{ flex: 1 }} />;
  }
  const { code } = route.params;
  const html = code;

  return <WebView source={{ html }} style={{ flex: 1 }} />;
}

// Stack Navigator
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WebView">
        <Stack.Screen name="Code" component={CodeScreen} />
        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={({ navigation }) => ({
            title: "My craft App",
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("Code")}
                title="Edit Code"
                color="#000"
              />
            )
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
