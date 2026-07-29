/**
 * Centralized Route Guard Listener
 *
 * Listens to reactive `authStatus` changes and executes navigation decisions.
 * Single Responsibility: Executes target route navigation derived from `determineDestination()`.
 *
 * Contains ZERO loading UI, ZERO Firebase SDK logic, and ZERO manual state math.
 */

import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/shared/hooks/useAuth';
import { determineDestination } from './route-resolver';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { authStatus } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const currentSegment = segments[0];
    const destination = determineDestination(authStatus, currentSegment);

    if (destination) {
      router.replace(destination);
    }
  }, [authStatus, segments, router]);

  return <>{children}</>;
};
