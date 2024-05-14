import { useState } from "react";
import { NEW_APP_CONTEXT } from "../contexts.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Alert, Button, Modal, TextInput, View } from "react-native";
import * as React from "react";
import { askGPT } from "../services/OpenAIService.ts";

function NewAppScreen({ navigation }: any) {
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    const receivedCode = await askGPT(NEW_APP_CONTEXT, prompt, 1);
    // @ts-ignore
    await AsyncStorage.setItem("savedCode", receivedCode);
    // @ts-ignore
    setCode(receivedCode);
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

export default NewAppScreen;
