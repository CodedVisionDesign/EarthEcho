"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const VARIANTS = {
  primary:
    "bg-forest text-white hover:bg-forest-dark focus-visible:ring-forest",
  secondary:
    "border border-gray-300 bg-white text-charcoal hover:bg-gray-50 focus-visible:ring-forest",
  ghost:
    "text-slate hover:bg-gray-100 hover:text-charcoal focus-visible:ring-forest",
  sunshine:
    "bg-sunshine text-charcoal hover:bg-sunshine-light focus-visible:ring-sunshine",
  danger:
    "bg-coral text-white hover:bg-red-700 focus-visible:ring-coral",
} as const;

const SIZES = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
} as const;

interface ButtonBaseProps {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  loading?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5" spin />
      ) : leftIcon ? (
        <FontAwesomeIcon icon={leftIcon} className="h-3.5 w-3.5" />
      ) : null}
      {children}
      {rightIcon && !loading && (
        <FontAwesomeIcon icon={rightIcon} className="h-3.5 w-3.5" />
      )}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { href: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} disabled={loading} {...buttonProps}>
      {content}
    </button>
  );
}
