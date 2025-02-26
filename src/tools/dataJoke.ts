import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

export const dataJokeTooDefinition = {
  name: 'dad_joke',
  description: 'Get a random dad joke',
  parameters: z
    .object({
      category: z.string().optional(),
    })
    .describe('Get a random dad joke'),
}

type Args = z.infer<typeof dataJokeTooDefinition.parameters>

export const dataJokeTool: ToolFn<Args, string> = async ({ toolArgs }) => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await response.json()
  return data.joke
}
