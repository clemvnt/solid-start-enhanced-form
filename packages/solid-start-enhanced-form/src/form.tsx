import { createEffect, untrack } from 'solid-js'
import { createStore } from 'solid-js/store'
import { FormProps } from 'solid-start'
import { RouteAction } from 'solid-start/data/createRouteAction'
import { enhancedFormContext } from './context'
import { FormDataValidator, ValidationErrors } from './validator'

export interface EnhancedFormConfig<T> {
  serverAction: RouteAction<FormData, Response>
  defaultValues?: Record<string, unknown>
  validator?: FormDataValidator<T>
}

function validateElement<T>(
  element: HTMLInputElement,
  validator?: FormDataValidator<T>
) {
  element.setCustomValidity('')

  if (validator?.hasValidator(element.name)) {
    const error = validator.validateField?.(element.name, element.value)
    if (error) {
      element.setCustomValidity(error)
      return error
    }

    return undefined
  }

  element.checkValidity()
  if (element.validationMessage) {
    return element.validationMessage
  }

  return undefined
}

export function createEnhancedForm<T>(config: EnhancedFormConfig<T>) {
  const { serverAction, validator, defaultValues } = config

  const fields: Record<string, HTMLInputElement> = {}

  const [errors, setErrors] = createStore<ValidationErrors>({})

  createEffect(() => {
    setErrors(serverAction.error?.fieldErrors ?? {})
  })

  function onSubmit(event: Event) {
    const errors: ValidationErrors = {}

    let errored = false

    for (const name in fields) {
      const element = fields[name]

      const error = validateElement(element, validator)

      if (error) {
        if (!errored) {
          errored = true
          event.preventDefault()
          fields[name].focus()
        }

        errors[name] = error
      }
    }

    setErrors(errors)
  }

  return {
    errors,
    setErrors,
    Form(props: FormProps) {
      return (
        <enhancedFormContext.Provider
          value={{
            registerField: (name, element) => (fields[name] = element),
            unregisterField: (name) => delete fields[name],
            getDefaultValue: (name) => defaultValues?.[name],
            getError: (name) => untrack(() => errors[name]),
            resetError: (name) => setErrors({ [name]: undefined }),
            validateField: (name) =>
              setErrors({
                [name]: validateElement(fields[name], validator)
              })
          }}
        >
          <serverAction.Form {...props} onSubmit={onSubmit} />
        </enhancedFormContext.Provider>
      )
    }
  }
}
