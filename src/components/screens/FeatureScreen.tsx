import { useState } from "react";
import { ADD_FEATURE_CONTEXT, MINIFICATION_CONTEXT } from "../../contextsForAI.ts";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Alert, Button, Modal, TextInput, View } from "react-native";
import * as React from "react";
import { askGPT } from "../../services/OpenAIService.ts";

function FeatureScreen({ navigation }: any) {
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(() => {
    loadCode();
  });

  const loadCode = async () => {
    const savedCode = await AsyncStorage.getItem("savedCode");
    if (savedCode) setCode(savedCode);
  };

  const handleEditCode = async () => {
    setLoading(true);
    const receivedCode = await askGPT(ADD_FEATURE_CONTEXT + code, prompt, 1);
    // @ts-ignore
    const minificatedCode = await askGPT(MINIFICATION_CONTEXT, receivedCode, 0);
    // @ts-ignore
    await AsyncStorage.setItem("savedCode", minificatedCode);
    // @ts-ignore
    setCode(minificatedCode);
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

export default FeatureScreen;
