import { onCleanup } from 'solid-js'
import { useEnhancedFormContext, EnhancedFormContext } from './context'

export function createEnhancedField() {
  let context: EnhancedFormContext

  let element: HTMLInputElement

  let firstMount = true

  function onMount(el: HTMLInputElement) {
    context = useEnhancedFormContext()

    element = el

    if (firstMount) {
      firstMount = false

      const defaultValue = context.getDefaultValue(element.name)
      if (defaultValue !== undefined) {
        element.value = defaultValue as string
      }
    }

    context.registerField(element.name, element)
    element.addEventListener('input', onInput)
    element.addEventListener('blur', onBlur)

    onCleanup(() => {
      context.unregisterField(element.name)
      element.removeEventListener('input', onInput)
      element.removeEventListener('blur', onBlur)
    })
  }

  function onInput() {
    context.resetError(element.name)
  }

  function onBlur() {
    context.validateField(element.name)
  }

  return {
    props: { ref: onMount },
    get error() {
      return context?.getError(element.name)
    },
    get valid() {
      return !this.error
    }
  }
}
