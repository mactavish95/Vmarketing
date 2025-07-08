import { OpenAI } from "openai";

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/nebius/v1",
	apiKey: process.env.HF_TOKEN,
});

const chatCompletion = await client.chat.completions.create({
	model: "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1",
    messages: [
        {
            role: "user",
            content: "What is the capital of France?",
        },
    ],
});

console.log(chatCompletion.choices[0].message);