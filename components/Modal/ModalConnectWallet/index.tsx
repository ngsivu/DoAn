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
  const [isShowSignUpModal, setIsShowSignUpModal] = useState(false);

  const { isShowConnectModal, isConnectingWallet } = useAppSelector(selectedConnection.getConnection);

  const handleHideModalConnectWallet = () => {
    dispatch(handleSetConnectModal(false));
    setIsShowForgotModal(false);
    setIsShowSignUpModal(false);
  };

  const handleCloseModalConnectWallet = () => {
    handleHideModalConnectWallet();
    dispatch(handleSetLoadingMetamask(false));
  };

  const onFinish = (values?: any) => {
    console.log('Finish:', values);
  };

  const aaa = () => {};

  const handleForgotPassword = () => {
    setIsShowForgotModal(!isShowForgotModal);
  };

  const handleSignUp = () => {
    setIsShowSignUpModal(!isShowSignUpModal);
  };

  const renderLogin = () => (
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
            name='email'
            rules={[{ required: true, message: 'Please input your email!' }]}
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
            rules={[{ required: true, message: 'Please input your password!' }]}
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
          <span onClick={handleSignUp}>Sign Up</span>
        </div>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className='wallet-modal'>
      <p className='title'>Lấy lại mật khẩu</p>
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
            name='email'
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Enter your email'
              className='form-item-input'
            />
          </Form.Item>
          <AppButton htmlType='submit' text='Send Password' onClick={aaa}></AppButton>
        </Form>
      </div>
    </div>
  );

  const renderSignUp = () => (
    <div className='wallet-modal'>
      <p className='title'>Sign Up</p>
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
            label='Your Name'
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Enter your name'
              className='form-item-input'
            />
          </Form.Item>

          <Form.Item
            label='Email address'
            name='email'
            rules={[{ required: true, message: 'Please input your email!' }]}
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
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Enter your password'
              className='form-item-input'
            />
          </Form.Item>
          <span className='forgot-password'></span>
          <AppButton htmlType='submit' text='Sign Up' onClick={aaa}></AppButton>
        </Form>
        <div className='sign-up'>
          <div className='sign-up__text'>{`Already have an account?`}&nbsp;</div>
          <span onClick={handleSignUp}>Sign In</span>
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
      showCloseIcon
      width={450}
    >
      {!(isShowForgotModal || isShowSignUpModal) && renderLogin()}
      {isShowForgotModal && renderForgotPassword()}
      {isShowSignUpModal && renderSignUp()}
    </Modal>
  );
};

export default ModalConnectWallet;
