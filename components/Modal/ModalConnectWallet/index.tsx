import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Form, Input, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import Modal from '@components//Modal';
import AppButton from '@components//AppButton';
import LoadingIcon from '@components//LoadingIcon';
import AppIcon from 'public/images/app_icon.png';

import MetaMaskIcon from 'public/svg/logo_metamask.svg';
import ConnectingIcon from 'public/svg/connecting_icon.svg';

import { handleSetConnectModal, handleSetLoadingMetamask, handleSetWrongNetwork } from 'redux/connection/slice';
import selectedConnection from 'redux/connection/selector';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';

const ModalConnectWallet = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [isShowForgotModal, setIsShowForgotModal] = useState(false);

  const { isShowConnectModal, isConnectingWallet } = useAppSelector(selectedConnection.getConnection);

  console.log('isShowConnectModal :>> ', isShowConnectModal);

  const handleHideModalConnectWallet = () => dispatch(handleSetConnectModal(false));

  const handleCloseModalConnectWallet = () => {
    handleHideModalConnectWallet();
    dispatch(handleSetLoadingMetamask(false));
  };

  const onFinish = (values?: any) => {
    console.log('Finish:', values);
  };

  const aaa = () => {};

  const handleForgotPassword = () => {
    handleHideModalConnectWallet();
    setIsShowForgotModal(true);
  };
  console.log('isShowForgotModal', isShowForgotModal);

  const renderConnectWallet = () => (
    <div className='wallet-modal'>
      <p className='title'>Welcome Back!</p>
      <img src={AppIcon} className='app-icon' />
      <div className='wallet-modal__body'>
        <Form
          form={form}
          name='basic'
          layout='vertical'
          initialValues={{ remember: true }}
          autoComplete='off'
          onFinish={onFinish}
        >
          <Form.Item
            label='Email address'
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Enter your email'
              className='form-item-input'
            />
          </Form.Item>
          <Form.Item
            className='form-item-password'
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Enter your password'
              className='form-item-input'
            />
          </Form.Item>

          <span className='forgot-password' onClick={handleForgotPassword}>
            Forgot your password?
          </span>
          <AppButton htmlType='submit' text='Login' onClick={aaa}></AppButton>
        </Form>
        <div className='sign-up'>
          <div className='sign-up__text'>{`Don't have an account?`}&nbsp;</div>
          <span onClick={aaa}>Sign Up</span>
        </div>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className='wallet-modal'>
      <p className='title'>Welcome Back!</p>
      <img src={AppIcon} className='app-icon' />
      <div className='wallet-modal__body'>
        <Form
          form={form}
          name='basic'
          layout='vertical'
          initialValues={{ remember: true }}
          autoComplete='off'
          onFinish={onFinish}
        >
          <Form.Item
            label='Email address'
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Enter your email'
              className='form-item-input'
            />
          </Form.Item>
          <Form.Item
            className='form-item-password'
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Enter your password'
              className='form-item-input'
            />
          </Form.Item>

          <span className='forgot-password' onClick={handleForgotPassword}>
            Forgot your password?
          </span>
          <AppButton htmlType='submit' text='Login' onClick={aaa}></AppButton>
        </Form>
        <div className='sign-up'>
          <div className='sign-up__text'>{`Don't have an account?`}&nbsp;</div>
          <span onClick={aaa}>Sign Up</span>
        </div>
      </div>
    </div>
  );

  const renderLoadingContent = () => (
    <div className='loading-metamask-modal'>
      <p className='title'>{t('common.txt_connecting_to_metamask')}</p>
      <img src={MetaMaskIcon} alt='' className='icon' />
      <Spin size='large' indicator={<LoadingIcon src={ConnectingIcon} />} />
    </div>
  );

  const renderNoMetamask = () => <div className='popup_metamask'>{renderLoadingContent()}</div>;

  return (
    <Modal
      visible={isShowConnectModal || isConnectingWallet}
      onClose={handleCloseModalConnectWallet}
      showCloseIcon={isShowConnectModal}
      width={450}
    >
      {isShowConnectModal && renderConnectWallet()}
      {/* {isShowForgotModal && renderForgotPassword()} */}
    </Modal>
  );
};

export default ModalConnectWallet;
