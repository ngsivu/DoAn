import React, { Fragment, ReactNode } from 'react';
import classNames from 'classnames';
import { Drawer } from 'antd';

type AppDrawerProps = {
  title?: string;
  visible?: boolean;
  onToggleDrawer?: any;
  toggleElement?: ReactNode;
  children?: ReactNode;
  className?: string;
  placement: 'top' | 'right' | 'bottom' | 'left' | undefined;
  height?: string | number;
};

const AppDrawer = ({ onToggleDrawer, visible, toggleElement, children, className, ...props }: AppDrawerProps) => {
  return (
    <Fragment>
      {toggleElement}
      <Drawer onClose={onToggleDrawer} visible={visible} className={classNames('app-drawer', className)} {...props}>
        {children}
      </Drawer>
    </Fragment>
  );
};

export default AppDrawer;
