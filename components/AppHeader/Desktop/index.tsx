import { useTranslation } from 'next-i18next';
import { useWeb3React } from '@web3-react/core';

import AppButton from '@components//AppButton';
import AppAddress from '@components//AppAddress';
import AppDropdown from '@components//AppDropdown';
import LoginButton from '@components//LoginButton';

import DisconnectIcon from 'public/svg/disconnect_icon.svg';

import selectedAddress from 'redux/address/selector';
import { handleSetAddressNetwork } from 'redux/address/slice';
import { handleSetAuthenticationToken } from 'redux/authentication/slice';
import selectedConnection from 'redux/connection/selector';

import { useAppDispatch, useAppSelector } from 'hooks/useStore';

import { getToken } from 'services/api';
import { shortenAddress } from 'utils';

import { walletConnect } from 'connectors';
import { METAMASK, WALLET_CONNECT } from 'connectors/constants';

const Desktop = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { deactivate } = useWeb3React();

  const { address } = useAppSelector(selectedAddress.getAddress);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  const handleDisconnect = () => {
    getToken('');
    deactivate();
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken(''));
    walletConnect.walletConnectProvider = undefined;
    localStorage.removeItem(WALLET_CONNECT);
    localStorage.removeItem(METAMASK);
  };

  const overlay = () => {
    return (
      <div className='header-overlay'>
        <div className='item header-overlay__address border-bottom-none'>
          <AppAddress address={address} addressClassName='text' />
        </div>
        <div className='item border-bottom-none' onClick={handleDisconnect}>
          <img src={DisconnectIcon} />
          <span>{t('home.txt_disconnect')}</span>
        </div>
      </div>
    );
  };

  return isConnected ? (
    <AppDropdown overlay={overlay}>
      <AppButton text={shortenAddress(address)} variant='default' className='app-header__button' />
    </AppDropdown>
  ) : (
    <LoginButton className='app-header__button' />
  );
};

export default Desktop;
