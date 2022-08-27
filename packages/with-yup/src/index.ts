import { GenericValidator, ValidationErrors } from 'solid-start-enhanced-form'
import {
  object,
  ObjectShape,
  InferType,
  ObjectSchema,
  TypeFromShape,
  AnyObject,
  ValidationError
} from 'yup'

function toValidationErrors(error: ValidationError): ValidationErrors {
  const errors: ValidationErrors = {}

  for (const innerError of error.inner) {
    if (innerError.path) {
      errors[innerError.path] = innerError.message
    }
  }

  return errors
}

export function withYup<T extends ObjectShape>(
  shape: T
): GenericValidator<InferType<ObjectSchema<TypeFromShape<T, AnyObject>>>> {
  const schema = object(shape)

  return {
    hasValidator(name) {
      return !!shape[name]
    },
    validate(data) {
      try {
        const result = schema.validateSync(data)
        return { success: true, data: result }
      } catch (error) {
        return {
          success: false,
          errors: toValidationErrors(error as ValidationError)
        }
      }
    },
    validateField(name, data) {
      try {
        schema.validateSyncAt(name, data)
        return undefined
      } catch (error) {
        return (error as ValidationError).message
      }
    }
  }
}
