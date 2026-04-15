import { xai } from '@ai-sdk/xai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: xai.responses('grok-4.20-reasoning'),
  tools: {
    getTemperature: tool({
      description: 'Get current temperature for a location',
      parameters: z.object({
        location: z.string().describe('City name'),
        unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit'),
      }),
      execute: async ({ location, unit }) => ({
        location,
        temperature: unit === 'fahrenheit' ? 59 : 15,
        unit,
      }),
    }),
  },
  prompt: 'What is the temperature in San Francisco?',
});

for await (const chunk of result.fullStream) {
  if (chunk.type === 'text-delta') {
    process.stdout.write(chunk.text);
  }
}
