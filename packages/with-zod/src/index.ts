import { GenericValidator, ValidationErrors } from 'solid-start-enhanced-form'
import { z, ZodError } from 'zod'

function toValidationErrors(error: ZodError): ValidationErrors {
  const errors: ValidationErrors = {}

  const { fieldErrors } = error.flatten()

  for (const key in fieldErrors) {
    const fieldError = fieldErrors[key]
    if (fieldError) {
      errors[key] = fieldError.join(' `')
    }
  }

  return errors
}

export function withZod<T extends z.ZodRawShape>(
  shape: T
): GenericValidator<z.infer<z.ZodObject<T>>> {
  const schema = z.object(shape)

  return {
    hasValidator(name) {
      return !!shape[name]
    },
    validate(data) {
      const result = schema.safeParse(data)

      return result.success
        ? result
        : { success: false, errors: toValidationErrors(result.error) }
    },
    validateField(name, data) {
      const result = schema
        .pick({ [name]: true } as Record<keyof T, true>)
        .safeParse(data)

      return result.success ? undefined : result.error.errors[0].message
    }
  }
}
