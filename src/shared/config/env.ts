/**
 * Generic Environment Helper & Validator
 *
 * Provides a reusable, strongly-typed environment variable parser.
 * Uses `process.env` as the single source of truth for `EXPO_PUBLIC_*` variables.
 */

/**
 * Reads an environment variable directly from process.env.
 * Treats empty or whitespace-only strings as undefined.
 */
export function readEnv(key: string): string | undefined {
  // eslint-disable-next-line expo/no-dynamic-env-var
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

/**
 * Validates that all required environment keys are present.
 * Throws a descriptive, fail-fast error if any are missing.
 *
 * @param keys Array of required environment variable names
 * @param serviceName Name of the service requiring these keys (e.g. 'Firebase', 'OpenAI')
 */
export function validateEnvKeys<K extends string>(
  keys: readonly K[],
  serviceName: string,
): Record<K, string> {
  const missing: K[] = [];
  const values = {} as Record<K, string>;

  for (const key of keys) {
    const value = readEnv(key);
    if (!value) {
      missing.push(key);
    } else {
      values[key] = value;
    }
  }

  if (missing.length > 0) {
    if (__DEV__) {
      const missingList = missing.map((k) => `  • ${k}`).join('\n');
      throw new Error(
        `[SelfOS] Missing required environment variables for ${serviceName}:\n\n${missingList}\n\n` +
          'Create or update your .env file in the project root using .env.example as a template.\n' +
          'Then restart the Expo development server.',
      );
    } else {
      throw new Error(
        `[SelfOS] ${serviceName} configuration is incomplete. Please check deployment environment.`,
      );
    }
  }

  return values;
}
