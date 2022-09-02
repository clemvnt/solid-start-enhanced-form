import { expect, it } from 'vitest'
import { array, object, string } from 'yup'
import { withYup } from './index'

it('should return a value indicating whether the field has validator', () => {
  const validator = withYup({
    firstName: string()
  })

  expect(validator.hasValidator('firstName')).toBe(true)
  expect(validator.hasValidator('lastName')).toBe(false)
})

it('should validate', () => {
  const validator = withYup({
    firstName: string(),
    lastName: string(),
    email: string().email(),
    hobbies: array(string()),
    location: object({
      country: string(),
      city: string()
    })
  })

  const result = validator.validate({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    hobbies: ['running', 'swimming'],
    location: {
      country: 'France',
      city: 'Paris'
    }
  })

  expect(result.success && result.data).toStrictEqual({
    email: 'john.doe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    hobbies: ['running', 'swimming'],
    location: {
      country: 'France',
      city: 'Paris'
    }
  })
})

it('should validate with errors', () => {
  const validator = withYup({
    firstName: string(),
    lastName: string(),
    email: string().email(),
    hobbies: array(string()),
    location: object({
      country: string(),
      city: string()
    })
  })

  const result = validator.validate({
    firstName: 1,
    lastName: {},
    email: 'john.doe',
    hobbies: ['running', 1],
    location: {
      country: 1,
      city: 1
    }
  })

  expect(!result.success && result.errors).toStrictEqual({
    email: 'email must be a valid email',
    firstName:
      'firstName must be a `string` type, but the final value was: `1`.',
    'hobbies[1]':
      'hobbies[1] must be a `string` type, but the final value was: `1`.',
    lastName:
      'lastName must be a `string` type, but the final value was: `{}`.',
    'location.city':
      'location.city must be a `string` type, but the final value was: `1`.',
    'location.country':
      'location.country must be a `string` type, but the final value was: `1`.'
  })
})

it('should validate field', () => {
  const validator = withYup({
    firstName: string(),
    lastName: string(),
    email: string().email(),
    hobbies: array(string()),
    location: object({
      country: string(),
      city: string()
    })
  })

  const errorMessage = validator.validateField('email', {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    hobbies: ['running', 'swimming'],
    location: {
      country: 'France',
      city: 'Paris'
    }
  })

  expect(errorMessage).toStrictEqual(undefined)
})

it('should validate field with error', () => {
  const validator = withYup({
    firstName: string(),
    lastName: string(),
    email: string().email(),
    hobbies: array(string()),
    location: object({
      country: string(),
      city: string()
    })
  })

  const errorMessage = validator.validateField('email', {
    firstName: 1,
    lastName: {},
    email: 'john.doe',
    hobbies: ['running', 1],
    location: {
      country: 1,
      city: 1
    }
  })

  expect(errorMessage).toBe('email must be a valid email')
})
