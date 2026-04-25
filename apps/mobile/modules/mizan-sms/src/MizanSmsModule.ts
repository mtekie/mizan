import { NativeModule, requireNativeModule } from 'expo';

import { MizanSmsModuleEvents } from './MizanSms.types';

declare class MizanSmsModule extends NativeModule<MizanSmsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MizanSmsModule>('MizanSms');
