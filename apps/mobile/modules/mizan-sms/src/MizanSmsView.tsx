import { requireNativeView } from 'expo';
import * as React from 'react';

import { MizanSmsViewProps } from './MizanSms.types';

const NativeView: React.ComponentType<MizanSmsViewProps> =
  requireNativeView('MizanSms');

export default function MizanSmsView(props: MizanSmsViewProps) {
  return <NativeView {...props} />;
}
