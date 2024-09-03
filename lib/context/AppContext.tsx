'use client'
import React, { createContext, useReducer } from 'react';
import appReducer from './appReducer';


export interface AppState {
  isRadioOn: boolean;
  isLightOn: boolean;
  isPhoneOn: boolean;
  modalOpen: {
    name: string | null;
  };
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<any>;
}

export const AppContext = createContext<AppContextType>({
  state: {
    isRadioOn: false,
    isLightOn: false,
    isPhoneOn: false,
    modalOpen: {name : null},
  },
  dispatch: () => {},
});

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, {
    isRadioOn: false,
    isLightOn: false,
    isPhoneOn: false,
    modalOpen: {name : null},
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
