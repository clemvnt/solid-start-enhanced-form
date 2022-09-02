import { expect, it } from 'vitest'
import { z } from 'zod'
import { withZod } from './index'

it('should return a value indicating whether the field has validator', () => {
  const validator = withZod({
    firstName: z.string()
  })

  expect(validator.hasValidator('firstName')).toBe(true)
  expect(validator.hasValidator('lastName')).toBe(false)
})

it('should validate', () => {
  const validator = withZod({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    hobbies: z.array(z.string()),
    location: z.object({
      country: z.string(),
      city: z.string()
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
  const validator = withZod({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    hobbies: z.array(z.string()),
    location: z.object({
      country: z.string(),
      city: z.string()
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
    email: 'Invalid email',
    firstName: 'Expected string, received number',
    'hobbies[1]': 'Expected string, received number',
    lastName: 'Expected string, received object',
    'location.city': 'Expected string, received number',
    'location.country': 'Expected string, received number'
  })
})

it('should validate field', () => {
  const validator = withZod({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    hobbies: z.array(z.string()),
    location: z.object({
      country: z.string(),
      city: z.string()
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

  expect(errorMessage).toBe(undefined)
})

it('should validate field with error', () => {
  const validator = withZod({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    hobbies: z.array(z.string()),
    location: z.object({
      country: z.string(),
      city: z.string()
    })
  })

  const errorMessage = validator.validateField('email', {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe',
    hobbies: ['running', 'swimming'],
    location: {
      country: 'France',
      city: 'Paris'
    }
  })

  expect(errorMessage).toBe('Invalid email')
})
