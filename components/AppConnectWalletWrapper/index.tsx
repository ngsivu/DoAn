import { FC, ReactNode, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import noop from 'lodash/noop';

import showMessage from '../Message';
import ModalWrongNetwork from '../Modal/ModalWrongNetwork';
import ModalConnectWallet from '../Modal/ModalConnectWallet';

import selectedAddress from 'redux/address/selector';
import selectedConnection from 'redux/connection/selector';
import selectAuthentication from 'redux/authentication/selector';
import { handleSetAuthenticationToken } from 'redux/authentication/slice';
import { handleSetLoadingMetamask, handleSetWrongNetwork, handleSetConnected } from 'redux/connection/slice';
import { handleAddAddressNetWork, handleSetAddressNetwork, handleSetConnectedWalletType } from 'redux/address/slice';

import loginServices from 'services/login';
import MetamaskService from 'services/MetamaskService';
import { checkSuccessRequest, getToken } from 'services/api';

import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useConnectWallet } from 'hooks/useConnectWallet';

import { setupNetwork } from 'utils/wallet';

import TYPE_CONSTANTS from 'constants/type';
import { walletConnect, injected } from 'connectors';
import { METAMASK, SUPPORTED_CHAIN_IDS, WALLET_CONNECT } from 'connectors/constants';

const AppConnectWalletWrapper: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { chainId, account, active, library } = useWeb3React();

  const { connectInjected, connectWalletConnect } = useConnectWallet();

  const { listAddress, connectedWalletType, address } = useAppSelector(selectedAddress.getAddress);
  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);
  const { isConnectingWallet } = useAppSelector(selectedConnection.getConnection);

  useEffect(() => {
    if (address && connectedWalletType && !active) {
      if (connectedWalletType === METAMASK) {
        connectInjected();
        dispatch(handleSetConnectedWalletType(METAMASK));
      }

      if (connectedWalletType === WALLET_CONNECT) {
        connectWalletConnect();
        dispatch(handleSetConnectedWalletType(WALLET_CONNECT));
      }
    }
  }, [address, connectedWalletType, active]);

  useEffect(() => {
    const setUpAddress = async () => {
      if (account) {
        const wallet = new MetamaskService().getInstance();

        // check is admin
        const isAdmin = await handleCheckIsAdmin(wallet);

        if (!isAdmin) {
          setupNetwork(chainId, library);
          if (!listAddress?.[account]) {
            handleLoginForFirstTime(wallet);
          } else {
            handleLoginWithExistedAccount(account);
          }
        }
      }
    };
    setUpAddress();
  }, [account, isConnectingWallet]);

  useEffect(() => {
    walletConnect.on('Web3ReactDeactivate', () => {
      localStorage.removeItem(WALLET_CONNECT);
      walletConnect.walletConnectProvider = undefined;
      handleDisconnect();
    });

    injected.on('Web3ReactDeactivate', () => {
      localStorage.removeItem(METAMASK);
      handleDisconnect();
    });

    return () => {
      walletConnect.removeListener('Web3ReactDeactivate', noop);
      injected.removeListener('Web3ReactDeactivate', noop);
    };
  }, [active, account]);

  useEffect(() => {
    const isWrongNetwork = authenticationToken && chainId && !SUPPORTED_CHAIN_IDS.includes(chainId);
    dispatch(handleSetWrongNetwork(isWrongNetwork));
  }, [chainId, authenticationToken]);

  useEffect(() => {
    if (address && account) {
      dispatch(handleSetConnected(true));
    } else {
      dispatch(handleSetConnected(false));
    }
  }, [address, account]);

  const handleLoginForFirstTime = async (wallet: MetamaskService) => {
    const signature = (await wallet.verifyLoginSignature({
      creator: account as string,
      library,
      cancelMetamask: () => {
        handleDisconnect();
        handleCancelLoadingMetamask();
      },
    })) as string;

    if (signature) {
      handleLogin({
        address: account as string,
        signature,
        success: () => {
          dispatch(
            handleAddAddressNetWork({
              address: account,
              signature,
            }),
          );
          dispatch(
            handleSetAddressNetwork({
              chainId,
              address: account,
            }),
          );
        },
        fail: handleLoginFailed,
      });
    }
  };

  const handleLoginWithExistedAccount = async (account: string) => {
    handleLogin({
      address: account as string,
      signature: listAddress?.[account]?.signature as string,
      success: () => {
        dispatch(
          handleSetAddressNetwork({
            chainId,
            address: account,
          }),
        );
      },
      fail: handleLoginFailed,
    });
  };

  const handleLogin = async ({
    address,
    signature,
    success,
    fail,
  }: {
    address: string;
    signature: string;
    success: () => void;
    fail: () => void;
  }) => {
    const data = {
      address,
      signature,
    };
    try {
      const response = await loginServices.handleLogin(data);
      if (checkSuccessRequest(response)) {
        const token = response?.data?.token;
        getToken(token);
        dispatch(handleSetAuthenticationToken(token));
        success();
      } else {
        fail();
      }
    } catch (error) {
    } finally {
      handleCancelLoadingMetamask();
    }
  };

  const handleCancelLoadingMetamask = () =>
    setTimeout(() => {
      dispatch(handleSetLoadingMetamask(false));
    }, 500);

  const handleDisconnect = () => {
    getToken('');
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken(''));
    walletConnect.walletConnectProvider = undefined;
    localStorage.removeItem(WALLET_CONNECT);
    localStorage.removeItem(METAMASK);
  };

  const handleLoginFailed = () => {
    handleDisconnect();
    showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E4', { name: 'common.txt_system_admin' });
  };

  const handleCheckIsAdmin = async (wallet: MetamaskService) => {
    const isAdmin = await wallet.isAdmin(library, account as string);
    if (isAdmin) {
      handleCancelLoadingMetamask();
      handleLoginFailed();
    }
    return isAdmin;
  };

  return (
    <>
      {children}
      <ModalWrongNetwork />
      <ModalConnectWallet />
    </>
  );
};

export default AppConnectWalletWrapper;
