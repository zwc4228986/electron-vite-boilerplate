import { ss } from '@/utils/storage'

const LOCAL_NAME = 'RoleStorage'

export function defaultState(): any {
  return {
    role_id: 1,
    role_name: '小抖AI',
  }
}

export function getLocalState(): any {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: any) {
  ss.set(LOCAL_NAME, state)
}
