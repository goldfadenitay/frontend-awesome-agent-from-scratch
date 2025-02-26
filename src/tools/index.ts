import { generateImageToolDefinition } from './generateImage'
import { dataJokeTooDefinition } from './dataJoke'
import { redditToolDefinition } from './reddit'

export const tools = [
  generateImageToolDefinition,
  dataJokeTooDefinition,
  redditToolDefinition,
]
