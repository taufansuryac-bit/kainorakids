/**
 * KAINORA AI - CLOUD AI HEALTH CHECK HOOK
 * Monitors cloud AI provider availability
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { cloudAIService } from '../services/cloudAIService';

const HEALTH_CHECK_INTERVAL = 60000;
const INITIAL_RETRY_DELAY = 10000;

export const useAIHealth = () => {
  const [health, setHealth] = useState({
    isAvailable: false,
    isChecking: true,
    lastCheck: null,
    providers: [],
    primaryProvider: null,
    workingProviders: [],
    error: null,
    retryCount: 0
  });

  const intervalRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  const checkHealth = useCallback(async () => {
    setHealth(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      const result = await cloudAIService.healthCheck();

      setHealth(prev => ({
        isAvailable: result.isAvailable,
        isChecking: false,
        lastCheck: new Date(),
        providers: result.providers || [],
        primaryProvider: result.primaryProvider,
        workingProviders: result.workingProviders || [],
        error: result.isAvailable ? null : result.status === 'unconfigured'
          ? 'API keys belum dikonfigurasi. Tambahkan di file .env.local'
          : 'Semua provider AI sedang unavailable',
        retryCount: result.isAvailable ? 0 : (prev?.retryCount || 0) + 1
      }));

      return result.isAvailable;
    } catch (error) {
      setHealth(prev => ({
        ...prev,
        isAvailable: false,
        isChecking: false,
        lastCheck: new Date(),
        error: error.message,
        retryCount: (prev?.retryCount || 0) + 1
      }));

      return false;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkHealth, 1000);
    return () => clearTimeout(timer);
  }, [checkHealth]);

  useEffect(() => {
    if (health.isAvailable) {
      intervalRef.current = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
    } else if (health.retryCount < 3) {
      retryTimeoutRef.current = setTimeout(checkHealth, INITIAL_RETRY_DELAY * (health.retryCount + 1));
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [health.isAvailable, health.retryCount, checkHealth]);

  return {
    ...health,
    checkHealth,
    shouldUseFallback: !health.isAvailable && health.retryCount >= 3,
    isConfigured: health.providers.length > 0,
    modelsAvailable: health.providers.filter(p => p.isAvailable).map(p => p.name)
  };
};

export default useAIHealth;
