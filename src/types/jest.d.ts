/**
 * Jest Type Declarations
 * 
 * This file provides TypeScript definitions for Jest globals
 * to prevent TypeScript errors in test files.
 */

declare global {
  // Jest test functions
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function test(name: string, fn: () => void | Promise<void>): void;
  
  // Jest lifecycle hooks
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;
  
  // Jest expect function
  function expect(actual: any): jest.Matchers<any>;
  
  // Jest object
  const jest: {
    fn(): jest.MockedFunction<any>;
    spyOn<T extends Record<string, any>, M extends keyof T>(object: T, method: M): jest.SpyInstance;
    mock(moduleName: string, factory?: () => any, options?: { virtual?: boolean }): typeof jest;
    unmock(moduleName: string): typeof jest;
    clearAllMocks(): typeof jest;
    resetAllMocks(): typeof jest;
    restoreAllMocks(): typeof jest;
    clearAllTimers(): void;
    useFakeTimers(): typeof jest;
    useRealTimers(): typeof jest;
    advanceTimersByTime(msToRun: number): void;
  };
  
  namespace jest {
    interface Matchers<R> {
      toBe(expected: any): R;
      toEqual(expected: any): R;
      toStrictEqual(expected: any): R;
      toBeDefined(): R;
      toBeUndefined(): R;
      toBeNull(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeGreaterThan(expected: number): R;
      toBeGreaterThanOrEqual(expected: number): R;
      toBeLessThan(expected: number): R;
      toBeLessThanOrEqual(expected: number): R;
      toBeCloseTo(expected: number, numDigits?: number): R;
      toContain(expected: any): R;
      toHaveLength(expected: number): R;
      toHaveProperty(propertyName: string, value?: any): R;
      toThrow(error?: string | RegExp | jest.Constructable | Error): R;
      toThrowError(error?: string | RegExp | jest.Constructable | Error): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(expected: number): R;
      toHaveBeenCalledWith(...args: any[]): R;
    }

    interface MockedFunction<T extends (...args: any[]) => any> {
      (...args: Parameters<T>): ReturnType<T>;
      mockImplementation(fn: T): this;
      mockReturnValue(value: ReturnType<T>): this;
      mockResolvedValue(value: ReturnType<T>): this;
      mockRejectedValue(value: any): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
    }

    interface SpyInstance<T = any, Y extends any[] = any[]> {
      mockImplementation(fn: (...args: Y) => T): this;
      mockReturnValue(value: T): this;
      mockResolvedValue(value: T): this;
      mockRejectedValue(value: any): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
    }

    type Constructable = new (...args: any[]) => any;
  }
}

export {};