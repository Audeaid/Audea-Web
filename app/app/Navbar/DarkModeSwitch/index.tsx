'use client';

import { Switch } from '@/components/ui/switch';
import { DarkModeContext } from '@/context/DarkMode';
import { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeSwitch = () => {
  const darkMode = useContext(DarkModeContext);

  return (
    <Switch
      checked={darkMode?.darkMode}
      onCheckedChange={() => {
        darkMode?.toggleDarkMode();
      }}
    >
      {darkMode?.darkMode ? (
        <Moon className="w-3 h-3" />
      ) : (
        <Sun className="w-3 h-3" />
      )}
    </Switch>
  );
};

export default DarkModeSwitch;
