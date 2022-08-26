import { createContext, useContext } from 'solid-js'

export interface EnhancedFormContext {
  registerField(name: string, element: HTMLInputElement): void
  unregisterField(name: string): void
  getDefaultValue(name: string): unknown
  getError(name: string): string | undefined
  resetError(name: string): void
  validateField(name: string): void
}

export const enhancedFormContext = createContext<EnhancedFormContext>()

export function useEnhancedFormContext() {
  const context = useContext(enhancedFormContext)
  if (!context) {
    throw new Error('The element must be in an enhanced form.')
  }

  return context
}
