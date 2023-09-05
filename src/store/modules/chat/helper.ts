import { ss } from '@/utils/storage'

const LOCAL_NAME = 'chatStorage'

const randomIntWithTimestamp = () => {
  const timestamp = new Date().getTime()
  return timestamp
}

export function defaultState(): Chat.ChatState {
  const uuid = randomIntWithTimestamp()
  return {
    active: uuid,
    usingContextTime: 0,
    usingContext: true,
    history: [{ uuid, title: 'New Chat', isEdit: false }],
    chat: [{ uuid, data: [] }],
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state)
}
