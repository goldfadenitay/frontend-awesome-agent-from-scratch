import { JSONFilePreset } from 'lowdb/node'
import type { AIMessage } from '../types'
import { v4 as uuidv4 } from 'uuid'

export type MessageWithMetadata = AIMessage & {
  id: string
  createdAt: string
}

type Data = {
  messages: MessageWithMetadata[]
}

export const addMetadata = (message: AIMessage) => ({
  ...message,
  id: uuidv4(),
  createdAt: Date.now().toString(),
})

export const removeMetadata = (message: MessageWithMetadata) => ({
  ...message,
  id: undefined,
  createdAt: undefined,
})

const defaultData: Data = {
  messages: [],
}

export const getDB = async () => {
  const db = await JSONFilePreset<Data>('db.json', defaultData)
  return db
}

export const addMessages = async (messages: AIMessage[]) => {
  const db = await getDB()
  db.data.messages.push(...messages.map(addMetadata))
  await db.write()
}

export const getMessages = async () => {
  const db = await getDB()
  return db.data.messages.map(removeMetadata)
}

export const saveToolResult = async (
  toolResult: string,
  toolCallId: string
) => {
  return addMessages([
    {
      role: 'tool',
      content: toolResult,
      tool_call_id: toolCallId,
    },
  ])
}
