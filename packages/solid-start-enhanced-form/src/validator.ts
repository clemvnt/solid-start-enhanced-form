export type ValidationErrors = Record<string, string | undefined>

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationErrors }

export interface GenericValidator<T, U = Record<string, unknown>> {
  hasValidator(name: string): boolean
  validate(data: U): ValidationResult<T>
  validateField(name: string, value: unknown): string | undefined
}

export type FormDataValidator<T> = GenericValidator<T, FormData>

export function createValidator<T>(
  validator: GenericValidator<T>
): FormDataValidator<T> {
  return {
    hasValidator(name) {
      return validator.hasValidator(name)
    },
    validate(data) {
      const obj: Record<string, unknown> = {}
      data.forEach((value, key) => (obj[key] = value))
      return validator.validate(obj)
    },
    validateField(name, data) {
      return validator.validateField(name, data)
    }
  }
}
