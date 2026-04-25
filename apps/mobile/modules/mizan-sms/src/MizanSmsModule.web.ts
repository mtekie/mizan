import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './MizanSms.types';

type MizanSmsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class MizanSmsModule extends NativeModule<MizanSmsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(MizanSmsModule, 'MizanSmsModule');
