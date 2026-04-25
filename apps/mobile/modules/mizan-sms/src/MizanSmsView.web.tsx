import * as React from 'react';

import { MizanSmsViewProps } from './MizanSms.types';

export default function MizanSmsView(props: MizanSmsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
