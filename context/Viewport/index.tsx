'use client';

import { createContext, useEffect, useState } from 'react';

interface ViewportContextType {
  isMobile: boolean;
}

export const ViewportContext = createContext<ViewportContextType>({
  isMobile: false,
});

interface IViewportProvider {
  children: React.ReactNode;
}

export const ViewportProvider: React.FC<IViewportProvider> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Change the breakpoint as per your requirements
    };

    // Initial check on component mount
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
};
