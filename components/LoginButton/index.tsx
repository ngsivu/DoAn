import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

import AppButton from '../AppButton';

import { handleSetConnectModal } from 'redux/connection/slice';
import { useAppDispatch } from 'hooks/useStore';

type LoginButtonProps = { className?: string };

const LoginButton = ({ className }: LoginButtonProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const handleShowConnectModal = () => dispatch(handleSetConnectModal(true));

  return (
    <AppButton
      text='Login'
      onClick={handleShowConnectModal}
      className={classNames('connect-wallet__button', className)}
    />
  );
};

export default LoginButton;
