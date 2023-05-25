'use client';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler } from 'react';

const RenderButtonComponent = ({
  type,
  icon,
  text,
  href,
  handleClick,
  xtraClassName,
}: {
  type: 'button' | 'anchor';
  icon: IconProp;
  text: string;
  href?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  xtraClassName?: string;
}) => {
  if (type === 'anchor') {
    return (
      <a href={href}>
        <button
          className={`text-base flex items-center gap-2 ${xtraClassName}`}
          type="button"
        >
          <span className="w-[24px] h-[24px] flex items-center justify-center">
            <FontAwesomeIcon icon={icon} />
          </span>
          {text}
        </button>
      </a>
    );
  } else {
    return (
      <button
        className={`text-base flex items-center gap-2 ${xtraClassName}`}
        type="button"
        onClick={handleClick}
      >
        <span className="w-[24px] h-[24px] flex items-center justify-center">
          <FontAwesomeIcon icon={icon} />
        </span>
        {text}
      </button>
    );
  }
};

export default RenderButtonComponent;
