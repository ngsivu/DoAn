import { appWithTranslation, useTranslation } from 'next-i18next';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Web3ReactProvider } from '@web3-react/core';

import AppConnectWalletWrapper from '@components//AppConnectWalletWrapper';
import PublicLayout from '@components//Layout/Public';
import EllipsisText from '@components//EllipsisText';

import MaintainIcon from 'public/images/maintain_icon.png';
import MaintainMobileIcon from 'public/images/maintain_mobile_icon.png';

import { wrapper } from 'redux/configStore';
import { namespace as AuthenticationNamespace } from 'redux/authentication/slice';
import { useGetConfig } from 'hooks/useGetConfig';
import { useGetAppConfig } from 'hooks/useGetAppConfig';
import { useMobile } from 'hooks/useWindowSize';

import { getToken } from 'services/api';

import { LIBRARY_CONSTANTS } from 'constants/library';

import 'antd/dist/antd.css';
import '../styles/_app.scss';

const onBeforeLift = (store: any) => () => {
  const state = store.getState();
  getToken(state?.[AuthenticationNamespace]?.authenticationToken);
};

const MyApp = ({ Component, pageProps }: any) => {
  const { t } = useTranslation();
  const store = useStore();
  const isMobile = useMobile();

  const isClient = typeof window !== 'undefined';

  const getLayout = Component?.getLayout ?? ((page: any) => page);

  useGetAppConfig();

  const { isMaintenance } = useGetConfig();

  return (
    <Web3ReactProvider getLibrary={LIBRARY_CONSTANTS.getLibrary}>
      {!isMaintenance ? (
        isClient ? (
          <PersistGate persistor={(store as any).__persistor} loading={null} onBeforeLift={onBeforeLift(store)}>
            <AppConnectWalletWrapper>{getLayout(<Component {...pageProps} />)}</AppConnectWalletWrapper>
          </PersistGate>
        ) : (
          <AppConnectWalletWrapper>
            <Component {...pageProps} />
          </AppConnectWalletWrapper>
        )
      ) : (
        <PublicLayout>
          <div className='maintain'>
            {isMobile ? <img src={MaintainMobileIcon} /> : <img src={MaintainIcon} />}
            <EllipsisText className='maintain__label' text={t('maintain.txt_on_the_way')} />
            <div className='maintain__content' dangerouslySetInnerHTML={{ __html: t('maintain.txt_thank_you') }} />
          </div>
        </PublicLayout>
      )}
    </Web3ReactProvider>
  );
};

export default wrapper.withRedux(appWithTranslation(MyApp));
