import { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import { Col, Row } from 'antd';

import AppLink from '../AppLink';

import AppLogo from 'public/images/app_icon.png';
import FooterBackground from 'public/images/footer_background.png';
import EmailIcon from 'public/svg/email_icon.svg';

import { routeURLs } from 'constants/routes';

type FooterProps = Record<string, never>;

type FooterInfoItem = {
  href: string;
  text?: string;
  icon?: string;
  prefixIcon?: string;
};

const Footer: React.FC<FooterProps> = ({}) => {
  const { t } = useTranslation('common');

  const infoAbout = [
    {
      text: 'Text text',
      href: '#',
    },
    {
      text: 'Text text',
      href: '#',
    },
    {
      text: 'Text text',
      href: '#',
    },
    { text: 'Text text', href: '#' },
  ];

  const infoContact = [
    {
      text: 'ngsivu4599@gmail.com',
      href: `mailto:ngsivu4599@gmail.com`,
      prefixIcon: EmailIcon,
    },
    { text: `+ 0987654321`, href: `tel:+0987654321`, prefixIcon: EmailIcon },
  ];

  const groupIcon = [
    { icon: EmailIcon, href: '#' },
    { icon: EmailIcon, href: '#' },
    { icon: EmailIcon, href: '#' },
    { icon: EmailIcon, href: '#' },
  ];

  const renderFooterItem = ({ href, text, icon, prefixIcon }: FooterInfoItem) => {
    return (
      <AppLink href={href}>
        {prefixIcon && <img src={prefixIcon} className='contact__icon' />}
        {text && <span className='app-button'>{text}</span>}
        {icon && <img className='icon' src={icon} />}
      </AppLink>
    );
  };

  return (
    <footer id='footer' className='app-footer'>
      <div className='footer-background' />
      <Row className='app-footer__body'>
        <Col md={6}>
          <AppLink href={routeURLs.HOME}>
            <img src={AppLogo} className='app-logo' />
          </AppLink>
        </Col>
        <Col md={6}>
          <div className='title'>About</div>
          <Row>
            {infoAbout.map((item, index) => (
              <Col md={12} xl={9} className='about' key={index}>
                {renderFooterItem(item)}
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={6}>
          <div className='title'>Contact </div>
          {infoContact.map((item, index) => (
            <div key={index} className='contact'>
              {renderFooterItem(item)}
            </div>
          ))}
        </Col>
        <Col md={6}>
          <div className='description'>Describe</div>
          <div className='description__group-icon'>
            {groupIcon.map((item, index) => (
              <Fragment key={index}>{renderFooterItem(item)}</Fragment>
            ))}
          </div>
        </Col>
      </Row>
      <div className='copy-right'>{t('home.txt_copy_right')}</div>
    </footer>
  );
};

export default Footer;
