import { ReactNode } from 'react';
import { Typography } from 'antd';

import EllipsisText from 'components/EllipsisText';

import CopyIcon from 'public/svg/copy_icon.svg';

import { shortenAddress } from 'utils';

const { Paragraph } = Typography;

type AddressCopyProps = {
  address: string;
  isVisibleCopy?: boolean;
  isShorten?: boolean;
  subAddress?: ReactNode;
  customAddress?: string;
  addressClassName?: string;
  srcCopy?: string;
};

const AppAddress = ({
  address,
  isVisibleCopy = true,
  isShorten = true,
  subAddress,
  customAddress,
  addressClassName,
  srcCopy,
}: AddressCopyProps) => {
  const renderAddress = customAddress ? customAddress : address;
  return (
    <div className="app-address">
      <EllipsisText text={isShorten ? shortenAddress(renderAddress) : renderAddress} className={addressClassName} />
      {subAddress && <EllipsisText text={subAddress} />}
      {isVisibleCopy && (
        <Paragraph
          copyable={{
            text: address,
            icon: <img className="app-address__icon" src={srcCopy || CopyIcon} key="copy-icon" />,
          }}
        />
      )}
    </div>
  );
};

export default AppAddress;
