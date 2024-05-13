import * as React from "react";
import { View, TextInput, Button, Alert, Text, Modal, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import OpenAI from "openai";
import { NEW_APP_CONTEXT, API_KEY, ADD_FEATURE_CONTEXT, MINIFICATION_CONTEXT } from "./consts.ts";
import { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { trimCode } from "./utils.ts";

const Drawer = createDrawerNavigator();

function NewAppScreen({ navigation }: any) {
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const openai = new OpenAI({ apiKey: API_KEY });

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        temperature: 1,
        messages: [{ role: "system", content: NEW_APP_CONTEXT }, { role: "user", content: prompt }],
        max_tokens: 4096
      });
      // @ts-ignore
      const receivedCode = trimCode(response.choices[0].message.content);
      await AsyncStorage.setItem("savedCode", receivedCode);
      setCode(receivedCode);
    } catch (error) {
      // @ts-ignore
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Modal
        transparent={true}
        animationType="none"
        visible={loading}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      <TextInput style={{ flex: 0.5, borderColor: "gray", borderWidth: 1, padding: 10 }} multiline
                 placeholder="Enter your prompt..." onChangeText={setPrompt} value={prompt} />
      <Button title="Generate Code" onPress={handleGenerateCode} />
      <TextInput style={{ flex: 1, borderColor: "gray", borderWidth: 1, marginTop: 10, padding: 10 }} multiline
                 placeholder="HTML/CSS/JS" onChangeText={setCode} value={code} />
      <Button title="Run App" onPress={() => {
        navigation.navigate("CustomAppScreen", { codeStamp: code });
        setCode("");
        setPrompt("");
      }}
      />
    </View>
  );
};

function CustomAppScreen({ route }: any) {
  const [code, setCode] = useState<null | string>(null);
  const handleMessage = (event: { nativeEvent: { data: any; }; }) => {
    // TODO: handle access to OS API
    const messageData = event.nativeEvent.data;
    Alert.alert("Message from WebView", messageData);
  };
  useEffect(() => {
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
    <WebView
      source={{
        html: `<html><body><div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-size: 60px">Your app will be here</div></body></html>`
      }}
      style={{ flex: 1 }} />;
}

function FeatureScreen({ navigation }: any) {
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const openai = new OpenAI({ apiKey: API_KEY });

  useFocusEffect(() => {
    loadCode();
  });

  const loadCode = async () => {
    const savedCode = await AsyncStorage.getItem("savedCode");
    if (savedCode) setCode(savedCode);
  };

  const handleEditCode = async () => {
    setLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        temperature: 1,
        messages: [{ role: "system", content: ADD_FEATURE_CONTEXT + code }, { role: "user", content: prompt }],
        max_tokens: 4096
      });
      // @ts-ignore
      const receivedCode = trimCode(response.choices[0].message.content);
      const minification = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        temperature: 1,
        messages: [{ role: "system", content: MINIFICATION_CONTEXT }, { role: "user", content: receivedCode }],
        max_tokens: 4096
      });
      const minificatedCode = trimCode(minification.choices[0].message.content);
      // @ts-ignore
      await AsyncStorage.setItem("savedCode", minificatedCode);
      setCode(minificatedCode);
    } catch (error) {
      // @ts-ignore
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Modal
        transparent={true}
        animationType="none"
        visible={loading}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      <TextInput style={{ flex: 0.5, borderColor: "gray", borderWidth: 1, padding: 10 }} multiline
                 placeholder="Enter your prompt..." onChangeText={setPrompt} value={prompt} />
      <Button title="Generate Feature" onPress={handleEditCode} />
      <TextInput style={{ flex: 1, borderColor: "gray", borderWidth: 1, marginTop: 10, padding: 10 }}
                 multiline
                 placeholder="HTML/CSS/JS"
                 onChangeText={async (value) => {
        AsyncStorage.setItem("savedCode", value);
        setCode(value);
      }}
                 value={code} />
      <Button title="Run App" onPress={() => navigation.navigate("CustomAppScreen", { codeStamp: code })} />
    </View>
  );
};

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
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
