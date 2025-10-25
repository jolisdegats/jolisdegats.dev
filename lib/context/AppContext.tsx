'use client'
import React, { createContext, useReducer } from 'react';
import appReducer from './appReducer';
import { Action } from './actions';


export interface AppState {
  showHelpMarkers: boolean;
  isRadioOn: boolean;
  isLightOn: boolean;
  isPhoneOn: boolean;
  isFridgeOpen: boolean;
  isVideoGamesBubbleOn: boolean;
  modalOpen: {
    name: string | null;
  };
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}


const initialState: AppState = {
  showHelpMarkers: false,
  isRadioOn: false,
  isLightOn: false,
  isPhoneOn: false,
  isVideoGamesBubbleOn: false,
  isFridgeOpen: false,
  modalOpen: {name : null},
}

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => {},
});

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
