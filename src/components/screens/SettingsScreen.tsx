import { useEffect, useState } from "react";
import { GPTmodels } from "../../utils.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";

function SettingsScreen() {
  const [selectedModel, setSelectedModel] = useState(GPTmodels.GPT4);

  useEffect(() => {
    const loadModelSetting = async () => {
      const model = await AsyncStorage.getItem('selectedModel');
      if (model) {
        // @ts-ignore
        setSelectedModel(model);
      }
    };
    loadModelSetting();
  }, []);

  const saveModelSetting = async (model: GPTmodels) => {
    await AsyncStorage.setItem('selectedModel', model);
    setSelectedModel(model);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Select GPT Model:</Text>
      <Picker
        selectedValue={selectedModel}
        onValueChange={(itemValue, itemIndex) => saveModelSetting(itemValue)}
      >
        {Object.values(GPTmodels).map((model, index) => (
          <Picker.Item key={index} label={model} value={model} />
        ))}
      </Picker>
    </View>
  );
};

export default SettingsScreen;
