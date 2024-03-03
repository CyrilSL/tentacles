import Link from "next/link";
import React from "react";

/**
 * Use this component as a simplified wrapper around the Next.js `<Link />` component.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
  passHref?: true;
  [x: string]: any;
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};

export default LocalizedClientLink;
