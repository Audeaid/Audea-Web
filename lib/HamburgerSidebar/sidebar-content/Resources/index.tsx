'use client';

import { faCircleQuestion, faVideo } from '@fortawesome/free-solid-svg-icons';
import RenderButtonComponent from '../../RenderButtonComponent';

export const Resources = () => {
  return (
    <section className="flex flex-col gap-2">
      <h6 className="flex gap-2 items-center text-gray-600 text-xs font-medium">
        RESOURCES <hr className="w-full h-[2px] bg-gray-600" />
      </h6>
      <section className="flex flex-col gap-2 font-medium text-onPrimaryContainer">
        <RenderButtonComponent
          icon={faVideo}
          text="How Audea Works"
          href="#"
          type="anchor"
        />

        <RenderButtonComponent
          icon={faCircleQuestion}
          text="Help Center"
          href="#"
          type="anchor"
        />
      </section>
    </section>
  );
};
