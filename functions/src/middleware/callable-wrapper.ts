/**
 * Callable Handler Middleware Wrapper
 *
 * Higher-order function wrapping Cloud Functions v2 `onCall` endpoints.
 * Automatically enforces authentication, schema validation, telemetry tracking, and error normalization.
 */

import { onCall, CallableRequest } from 'firebase-functions/v2/https';
import { FUNCTION_CONFIG } from '../shared/config';
import { logger } from '../shared/logger';
import { telemetry } from '../shared/telemetry';
import { normalizeCallableError } from '../shared/errors';
import { validateAuth } from '../shared/validation';

export interface CallableHandlerOptions<TInput> {
  name: string;
  requireAuth?: boolean;
  validatePayload?: (data: unknown) => TInput;
  handler: (input: TInput, context: { uid: string | null; request: CallableRequest<TInput> }) => Promise<unknown>;
}

export function createCallableHandler<TInput = unknown>(options: CallableHandlerOptions<TInput>) {
  const { name, requireAuth = true, validatePayload, handler } = options;

  return onCall(
    {
      region: FUNCTION_CONFIG.region,
      memory: FUNCTION_CONFIG.defaultMemory,
      timeoutSeconds: FUNCTION_CONFIG.defaultTimeoutSeconds,
    },
    async (request: CallableRequest<unknown>) => {
      const startTime = Date.now();
      logger.info(name, `Callable invocation initiated`);

      try {
        let uid: string | null = null;
        if (requireAuth) {
          uid = validateAuth(request as CallableRequest<unknown>);
        } else if (request.auth) {
          uid = request.auth.uid;
        }

        const validatedInput = validatePayload
          ? validatePayload(request.data)
          : (request.data as TInput);

        const result = await handler(validatedInput, {
          uid,
          request: request as CallableRequest<TInput>,
        });

        const durationMs = Date.now() - startTime;
        telemetry.recordMetric({
          name: `${name}_latency`,
          value: durationMs,
          unit: 'ms',
        });

        logger.info(name, `Callable completed successfully in ${durationMs}ms`);
        return result;
      } catch (error) {
        telemetry.captureException(error, { callableName: name });
        throw normalizeCallableError(error, name);
      }
    }
  );
}
