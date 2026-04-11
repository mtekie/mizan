import * as LocalAuthentication from 'expo-local-authentication';

export async function checkBiometricAvailability(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const isAvailable = await checkBiometricAvailability();
  
  if (!isAvailable) return false;
  
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Mizan',
      cancelLabel: 'Use Password',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });
    
    return result.success;
  } catch (error) {
    console.error('Biometric auth failed', error);
    return false;
  }
}
