import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Dropdown } from 'antd';

type AppDropdownProps = {
  overlay: any;
  children?: ReactNode;
  placement?: string | any;
  trigger?: string | any;
  className?: string;
};

const AppDropdown = ({ children, trigger, className, ...props }: AppDropdownProps) => {
  return (
    <Dropdown
      overlayClassName={classNames('app-dropdown', className)}
      trigger={[trigger]}
      getPopupContainer={(trigger: any) => trigger.parentElement}
      {...props}
    >
      {children}
    </Dropdown>
  );
};

AppDropdown.defaultProps = {
  placement: 'bottomRight',
  trigger: 'click',
};

export default AppDropdown;
