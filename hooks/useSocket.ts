import { useEffect } from 'react';
import { isArray } from 'lodash';

import selectedAddress from 'redux/address/selector';

import Socket from 'services/SocketService';

import { useAppSelector } from './useStore';

export const useSocket = ({
  event,
  handleEvent,
  dependencies,
  nonAuth,
}: {
  event: string | string[];
  handleEvent: any;
  dependencies?: any;
  nonAuth?: boolean;
}) => {
  const { address } = useAppSelector(selectedAddress.getAddress);

  useEffect(() => {
    const socketIo = new Socket();
    const socketInstance = socketIo.getInstance(address);

    if (address || nonAuth) {
      if (typeof event === 'string') {
        socketInstance.on(event, handleEvent);
      } else if (isArray(event)) {
        event.forEach((e: string) => {
          socketInstance.on(e, handleEvent);
        });
      }
    }
    return () => {
      if (address || nonAuth) {
        if (typeof event === 'string') {
          socketInstance.off(event, handleEvent);
        } else if (isArray(event)) {
          event.forEach((e: string) => {
            socketInstance.off(e, handleEvent);
          });
        }
      }
    };
  }, [address, ...(dependencies || [])]);
};
