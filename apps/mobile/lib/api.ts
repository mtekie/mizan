import Constants from 'expo-constants';
import { MizanAPI } from '@mizan/api-client';
import { supabase } from './auth';

/**
 * Mizan API Client
 * 
 * For Android Emulators, localhost is mapped to 10.0.2.2
 * For physical devices, we try to detect the host IP from expo-constants
 */
const debuggerHost = Constants.expoConfig?.hostUri;
const localIP = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${localIP}:3000`;

export const api = new MizanAPI({
  baseUrl: BASE_URL,
  getToken: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    } catch (error) {
      console.error('Failed to get session token:', error);
      return null;
    }
  },
});
