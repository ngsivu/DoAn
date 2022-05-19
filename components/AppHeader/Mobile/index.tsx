import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useWeb3React } from '@web3-react/core';
import { Drawer } from 'antd';
import noop from 'lodash/noop';

import AppLink from '@components//AppLink';
import AppAddress from '@components//AppAddress';
import LoginButton from '@components//LoginButton';

import AppIcon from 'public/images/app_logo.png';
import MenuIcon from 'public/svg/menu_icon.svg';
import CloseIcon from 'public/svg/close_icon.svg';
import DisconnectIcon from 'public/svg/disconnect_icon.svg';

import selectedAddress from 'redux/address/selector';
import selectedConnection from 'redux/connection/selector';
import { handleSetAddressNetwork } from 'redux/address/slice';
import { handleSetAuthenticationToken } from 'redux/authentication/slice';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';

import { getToken } from 'services/api';

import { routeURLs } from 'constants/routes';
import { walletConnect } from 'connectors';
import { METAMASK, WALLET_CONNECT } from 'connectors/constants';

const Mobile = () => {
  const { t } = useTranslation();
  const { deactivate } = useWeb3React();

  const dispatch = useAppDispatch();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  const [visible, setVisible] = useState(false);

  const handleOpenMenu = () => setVisible(!visible);

  const handleCloseMenu = () => setVisible(false);

  const handleDisconnect = () => {
    getToken('');
    deactivate();
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken(''));
    walletConnect.walletConnectProvider = undefined;
    localStorage.removeItem(WALLET_CONNECT);
    localStorage.removeItem(METAMASK);
  };

  const renderHeaderDrawer = () => {
    return (
      <div className='container'>
        <AppLink href={routeURLs.HOME}>
          <img src={AppIcon} alt='app icon' />
        </AppLink>
        <img src={CloseIcon} alt='close icon' onClick={handleCloseMenu} />
      </div>
    );
  };

  const listMenus = [
    {
      label: t('home.txt_disconnect'),
      icon: DisconnectIcon,
      onClick: handleDisconnect,
    },
  ];

  const renderHeaderContent = useMemo(() => {
    return (
      <div className='menu-mobile'>
        <AppAddress address={address} />
        <div className='menu'>
          {listMenus.map((menu: any) => {
            const { isLink, href, icon, label, onClick } = menu;
            const menuItemRendered = (
              <div className='item' onClick={onClick ?? noop}>
                <img src={icon} />
                <span>{label}</span>
              </div>
            );
            return isLink ? <AppLink href={href}>{menuItemRendered}</AppLink> : menuItemRendered;
          })}
        </div>
      </div>
    );
  }, [address]);

  return (
    <div className='mobile-header'>
      <img src={MenuIcon} className='mobile-header__icon' onClick={handleOpenMenu} />

      <Drawer
        title={renderHeaderDrawer()}
        visible={visible}
        closable={false}
        placement='right'
        className='mobile-drawer'
        onClose={handleOpenMenu}
      >
        <div className='container'>
          {!isConnected ? <LoginButton className='connect-wallet-mobile' /> : renderHeaderContent}
        </div>
      </Drawer>
    </div>
  );
};

export default Mobile;
