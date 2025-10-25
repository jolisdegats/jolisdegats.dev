// lib/context/appReducer.ts

import { Action } from "./actions";
import { AppState } from "./AppContext";

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'TOGGLE_HELP_MARKERS':
      return { ...state, showHelpMarkers: !state.showHelpMarkers };
      case 'TOGGLE_RADIO':
        return { ...state, isRadioOn: !state.isRadioOn };
    case 'TOGGLE_LIGHT':
      return { ...state, isLightOn: !state.isLightOn };
    case 'TOGGLE_PHONE':
      return { ...state, isPhoneOn: !state.isPhoneOn };
      case 'CHANGE_MODAL':
          return { ...state, modalOpen: action.payload };
      case 'TOGGLE_FRIDGE':
          return { ...state, isFridgeOpen: !state.isFridgeOpen };
      case 'TOGGLE_VIDEO_GAMES_BUBBLE':
          return { ...state, isVideoGamesBubbleOn: !state.isVideoGamesBubbleOn };
    default:
      return state;
  }
};

export default appReducer;
