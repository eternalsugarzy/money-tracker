import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export interface NeoTheme {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    card: string;
    cardSecondary: string;
    text: string;
    textMuted: string;
    border: string;
    shadow: string;
    primary: string; // Electric Yellow
    primaryText: string;
    income: string; // Lime green
    incomeText: string;
    expense: string; // Hot Pink
    expenseText: string;
    transfer: string; // Electric Blue / Cyan
    transferText: string;
    debt: string; // Vivid Orange
    debtText: string;
    accent: string; // Purple
    accentText: string;
    danger: string;
    warning: string;
    success: string;
    inputBg: string;
  };
  neo: {
    borderWidth: number;
    borderWidthThick: number;
    borderRadius: number;
    borderRadiusSm: number;
    borderRadiusLg: number;
    shadow: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    shadowSm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    shadowPressed: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

const lightTheme: NeoTheme = {
  isDark: false,
  colors: {
    background: '#FFFDF7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    cardSecondary: '#F5F2EB',
    text: '#121212',
    textMuted: '#5E5E5E',
    border: '#121212',
    shadow: '#121212',
    primary: '#FFE600',
    primaryText: '#121212',
    income: '#54E346',
    incomeText: '#0A3B0A',
    expense: '#FF5D8F',
    expenseText: '#3B0A18',
    transfer: '#00F0FF',
    transferText: '#00363B',
    debt: '#FF7A00',
    debtText: '#3B1900',
    accent: '#A06CD5',
    accentText: '#23083B',
    danger: '#FF3366',
    warning: '#FFBE0B',
    success: '#54E346',
    inputBg: '#FFFFFF',
  },
  neo: {
    borderWidth: 2.5,
    borderWidthThick: 3.5,
    borderRadius: 12,
    borderRadiusSm: 8,
    borderRadiusLg: 16,
    shadow: {
      shadowColor: '#121212',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 6,
    },
    shadowSm: {
      shadowColor: '#121212',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    shadowPressed: {
      shadowColor: '#121212',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 1,
    },
  },
};

const darkTheme: NeoTheme = {
  isDark: true,
  colors: {
    background: '#121216',
    surface: '#1E1E24',
    card: '#24242C',
    cardSecondary: '#2E2E38',
    text: '#FDFDFD',
    textMuted: '#A2A2B0',
    border: '#3C3C4B',
    shadow: '#000000',
    primary: '#FFE600',
    primaryText: '#121212',
    income: '#54E346',
    incomeText: '#0A3B0A',
    expense: '#FF5D8F',
    expenseText: '#3B0A18',
    transfer: '#00F0FF',
    transferText: '#00363B',
    debt: '#FF7A00',
    debtText: '#3B1900',
    accent: '#A06CD5',
    accentText: '#FFFFFF',
    danger: '#FF3366',
    warning: '#FFBE0B',
    success: '#54E346',
    inputBg: '#1A1A20',
  },
  neo: {
    borderWidth: 2.5,
    borderWidthThick: 3.5,
    borderRadius: 12,
    borderRadiusSm: 8,
    borderRadiusLg: 16,
    shadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 6,
    },
    shadowSm: {
      shadowColor: '#000000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    shadowPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 1,
    },
  },
};

interface ThemeContextType {
  theme: NeoTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const setDarkMode = (enabled: boolean) => {
    setIsDark(enabled);
  };

  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDark, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
