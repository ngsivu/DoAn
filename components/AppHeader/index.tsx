import Mobile from './Mobile';
import Desktop from './Desktop';
import AppLink from '../AppLink';
import Notification from '../Notification';

import AppIcon from 'public/images/app_icon.png';

import { useMobile } from 'hooks/useWindowSize';
import { useAppSelector } from 'hooks/useStore';
import { useGetConfig } from 'hooks/useGetConfig';

import { routeURLs } from 'constants/routes';
import selectedConnection from 'redux/connection/selector';

type HeaderProps = Record<string, never>;

const Header: React.FC<HeaderProps> = () => {
  const isMobile = useMobile();

  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const { isMaintenance } = useGetConfig();

  return (
    <header className='app-header'>
      <div className='container'>
        <AppLink href={routeURLs.HOME}>
          <img src={AppIcon} className='app-header__app-icon' />
        </AppLink>

        {!isMaintenance && (
          <div className='app-header__toogle'>
            {isConnected && <Notification />}
            {isMobile ? <Mobile /> : <Desktop />}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
