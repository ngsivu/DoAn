import { useEffect, FC } from 'react';
import { useTranslation } from 'next-i18next';
import { Typography, Spin } from 'antd';

import LoadingIcon from '@components//LoadingIcon';
import Modal from '..';

import selectedConnection from 'redux/connection/selector';
import { setupNetwork } from 'utils/wallet';

import { SupportedChainId } from 'connectors/constants';
import { useAppSelector } from 'hooks/useStore';

type ModalWrongNetworkProps = {};

const ModalWrongNetwork: FC<ModalWrongNetworkProps> = ({}) => {
  const { t } = useTranslation();

  const { isWrongNetwork } = useAppSelector(selectedConnection.getConnection);

  const targetChainId = SupportedChainId.BSC;

  useEffect(() => {
    if (isWrongNetwork) {
      const switchNetwork = async () => {
        if (targetChainId) {
          await setupNetwork(targetChainId);
        }
      };

      switchNetwork();
    }
  }, [isWrongNetwork]);

  return (
    <Modal visible={isWrongNetwork} maskClosable={false} showCloseIcon={false} destroyOnClose>
      <div className="wrong-network-modal">
        <Spin indicator={<LoadingIcon />} />
        <p className="title">{t('common.network_notice_title')}</p>
        <span
          dangerouslySetInnerHTML={{
            __html: t('common.txt_wrong_network_content', { networkName: 'BSC' }),
          }}
          className="sub-title"
        />
      </div>
    </Modal>
  );
};

export default ModalWrongNetwork;
