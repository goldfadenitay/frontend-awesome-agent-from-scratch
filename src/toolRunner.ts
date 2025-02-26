import type OpenAI from 'openai'
import {
  generateImageTool,
  generateImageToolDefinition,
} from './tools/generateImage'
import { dataJokeTool, dataJokeTooDefinition } from './tools/dataJoke'
import { redditTool, redditToolDefinition } from './tools/reddit'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    case generateImageToolDefinition.name:
      return generateImageTool(input)
    case dataJokeTooDefinition.name:
      return dataJokeTool(input)
    case redditToolDefinition.name:
      return redditTool(input)
    default:
      return `Never run this tool again: ${toolCall.function.name} again.`
  }
}
