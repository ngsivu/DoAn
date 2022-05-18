import React from 'react';
import Link from 'next/link';

type AppLinkProps = {
  href: string;
  children?: any;
  target?: string | undefined;
  rel?: string | undefined;
  onClick?: () => void;
};

const AppLink = ({ href, children, target = undefined, rel = undefined, onClick, ...props }: AppLinkProps) => {
  return (
    <Link href={href} {...props}>
      <a target={target} onClick={onClick} rel={rel}>
        {children}
      </a>
    </Link>
  );
};

export default AppLink;
