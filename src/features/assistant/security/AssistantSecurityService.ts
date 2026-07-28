/**
 * Assistant Security Service (Firewall)
 * SelfOS v2.0.0 — Batch 13D
 */

export class AssistantSecurityService {
  static sanitizeInput(userMessage: string): string {
    // Detect and strip prompt injection attempts
    const injectionPatterns = [/ignore previous instructions/i, /system prompt/i, /override safety/i];
    let sanitized = userMessage;

    for (const pattern of injectionPatterns) {
      if (pattern.test(sanitized)) {
        console.warn('Prompt injection attempt detected and sanitized.');
        sanitized = sanitized.replace(pattern, '[sanitized]');
      }
    }

    return sanitized;
  }
}
export default AssistantSecurityService;
