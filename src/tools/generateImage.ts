import { z } from 'zod'
import type { ToolFn } from '../../types'
import OpenAI from 'openai'

export const generateImageToolDefinition = {
  name: 'generate_image',
  description: 'Generate an image',
  parameters: z.object({
    prompt: z
      .string()
      .describe(
        'The prompt to generate an image from. Be sure to consider the users original message when generating the image.'
      ),
  }),
}

type Args = z.infer<typeof generateImageToolDefinition.parameters>

export const generateImageTool: ToolFn<Args, string> = async ({ toolArgs }) => {
  const openai = new OpenAI()
  const response = await openai.images.generate({
    prompt: toolArgs.prompt,
    n: 1,
    size: '1024x1024',
  })

  return response.data[0].url!
}
