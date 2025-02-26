import type { ChatCompletionMessageToolCall } from 'openai/resources/index.mjs'
import { runLLM } from './llm'
import { addMessages, getMessages, saveToolResult } from './memory'
import { logMessage, showLoader } from './ui'
import { zodFunction } from 'openai/helpers/zod'
import { runTool } from './toolRunner'

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: any[]
}) => {
  const formattedTools = tools.map((tool) => zodFunction(tool))
  await addMessages([{ role: 'user', content: userMessage }])

  const loader = showLoader('Thinking...')

  while (true) {
    const history = await getMessages()
    const response = await runLLM({ messages: history, tools: formattedTools })
    await addMessages([response])

    if (response.content) {
      loader.stop()
      return getMessages()
    }

    if (response.tool_calls) {
      const toolCalls = response.tool_calls[0]
      loader.update(`Running tool: ${toolCalls.function.name}`)
      const toolResult = await runTool(toolCalls, userMessage)
      await saveToolResult(toolResult, toolCalls.id)

      loader.update(`Tool result: ${toolResult}`)
    }

    logMessage(response)
  }

  loader.stop()

  return getMessages()
}
