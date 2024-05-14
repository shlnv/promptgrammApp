import AsyncStorage from "@react-native-async-storage/async-storage";
import { GPTmodels, trimCode } from "../utils.ts";
import { Alert } from "react-native";
import { openai } from "../../App.tsx";

export const askGPT = async (context: string, prompt: string, temperature: number) => {
  const model = await AsyncStorage.getItem("selectedGPTModel") || GPTmodels.GPT4;
  try {
    const response = await openai.chat.completions.create({
      model: model,
      temperature: temperature,
      messages: [{ role: "system", content: context }, { role: "user", content: prompt }],
      max_tokens: 4095,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    console.log(response);
    return trimCode(response.choices[0].message.content);
  } catch (error) {
    console.log("CATCH");
    console.log(error);
    // @ts-ignore
    Alert.alert(error.message);
  }
};
