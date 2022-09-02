export type ValidationErrors = Record<string, string | undefined>

export type ValidValidationResult<T> = { success: true; data: T }

export type InvalidValidationResult = {
  success: false
  errors: ValidationErrors
}

export type ValidationResult<T> =
  | ValidValidationResult<T>
  | InvalidValidationResult

export interface GenericValidator<T, U = unknown> {
  hasValidator(name: string): boolean
  validate(data: U): ValidationResult<T>
  validateField(name: string, value: U): string | undefined
}

export type FormDataValidator<T> = GenericValidator<T, FormData>

function convertFormDataToRecord(formData: FormData) {
  const data: Record<string, unknown> = {}
  formData.forEach((value, key) => (data[key] = value))
  return data
}

export function createValidator<T>(
  validator: GenericValidator<T>
): FormDataValidator<T> {
  return {
    hasValidator(name) {
      return validator.hasValidator(name)
    },
    validate(data) {
      return validator.validate(convertFormDataToRecord(data))
    },
    validateField(name, data) {
      return validator.validateField(name, convertFormDataToRecord(data))
    }
  }
}
