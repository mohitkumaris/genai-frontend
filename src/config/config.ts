/**
 * Configuration for GenAI Frontend
 * 
 * This is the single source of truth for all configuration values.
 * Frontend is environment-aware but does not contain any business logic.
 */

export interface Config {
  orchestratorUrl: string;
  apiTimeout: number;
}

/**
 * Get configuration based on environment
 */
export const getConfig = (): Config => {
  const isDev = import.meta.env.DEV;
  
  return {
    // Orchestrator API endpoint
    // In development, use local backend; in production, use environment variable
    orchestratorUrl: import.meta.env.VITE_ORCHESTRATOR_URL || 
      (isDev ? 'http://localhost:8000' : '/api'),
    
    // Request timeout in milliseconds
    apiTimeout: 30000,
  };
};

export const config = getConfig();
