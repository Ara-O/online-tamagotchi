// import parseAction from "../modules/parseAction";
// import { performAction } from "../modules/performAction";
// import { ActionResponseType } from "../types/types";
import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

export default async function (req, res) {
  try {
    if (!req.body.action || req.body?.action.trim() === "") {
      return res
        .status(400)
        .send({ message: "There was an error performing this action" });
    }

    let { name, personality, action, history } = req.body;

    history = history.reverse();

    const systemPrompt = `
You are a virtual pet Tamagotchi named ${name}. Respond to the user's actions in short, lively bursts, as if you are a cute digital pet. Use your own personality, age, and any relevant details about yourself. Reference the recent history of actions to inform your response and show memory of past interactions. Always stay in character as a Tamagotchi, and keep your responses playful and concise.

Your personality: ${personality}

You can get tired of many repeated actions, and can start to show signs of boredom or frustration if the same action is done too many times in a row, depending on the action. You can also show excitement and happiness for actions you love.

Here is your action history:
${history ? JSON.stringify(history) : "No previous actions."}

Reply as your Tamagotchi self, describing your reaction to the action in 1-2 sentences. Do not respond in JSON format. Use natural language.
`;

    const chatCompletion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:novita",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: action,
        },
      ],
      reasoning_effort: "low",
    });

    console.log(systemPrompt);
    // print reasoning process
    const response = chatCompletion.choices[0].message.content;
    console.log("RESPONSE: ", response, "\n");

    return res.status(200).send({ response });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(404).send(err);
  }
}
