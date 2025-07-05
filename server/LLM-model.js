import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '$API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC',
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

async function main() {
  const completion = await openai.chat.completions.create({
    model: "nvidia/llama-3.3-nemotron-super-49b-v1",
    messages: [{"role":"system","content":"detailed thinking on"}],
    temperature: 0.6,
    top_p: 0.95,
    max_tokens: 4096,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  })
   
  for await (const chunk of completion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
  
}

main();