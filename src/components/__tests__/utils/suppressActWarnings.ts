/**
 * Helper to suppress act() warnings from antd components
 */

const originalError = console.error

export function suppressAntdActWarnings(): void {
  console.error = (...args: Parameters<typeof console.error>) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to List inside a test was not wrapped in act')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
}

export function restoreConsoleError(): void {
  console.error = originalError
}

/**
 * Setup and teardown antd warnings in tests
 */
export function setupAntdActWarningSuppression(): {
  beforeAll: () => void
  afterAll: () => void
} {
  return {
    beforeAll: () => suppressAntdActWarnings(),
    afterAll: () => restoreConsoleError(),
  }
}
