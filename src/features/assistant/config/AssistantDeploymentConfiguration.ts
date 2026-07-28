/**
 * Assistant Deployment Configuration
 * SelfOS v2.0.0 — Batch 13D
 */

export class AssistantDeploymentConfiguration {
  getEnvironment(): 'development' | 'production' {
    return __DEV__ ? 'development' : 'production';
  }
}

export const assistantDeploymentConfiguration = new AssistantDeploymentConfiguration();
export default assistantDeploymentConfiguration;
