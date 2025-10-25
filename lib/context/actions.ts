type ToggleModalPayload = { name : string, parameters? : Record<string, unknown>}

export type Action =
  | { type: 'TOGGLE_RADIO' }
  | { type: 'TOGGLE_LIGHT' }
  | { type: 'TOGGLE_PHONE' }
  | { type: 'TOGGLE_HELP_MARKERS'}
  | { type: 'TOGGLE_FRIDGE'}
  | { type: 'TOGGLE_VIDEO_GAMES_BUBBLE'}
  | { type: 'CHANGE_MODAL', payload : ToggleModalPayload }


export const toggleRadio = (): Action => ({
  type: 'TOGGLE_RADIO',
});

export const toggleLight = (): Action => ({
  type: 'TOGGLE_LIGHT',
});

export const togglePhone = (): Action => ({
  type: 'TOGGLE_PHONE',
});

export const toggleFridge = (): Action => ({
  type: 'TOGGLE_FRIDGE',
});

export const changeModal = (payload : ToggleModalPayload): Action => ({
  type: 'CHANGE_MODAL',
  payload
});

export const toggleHelpMarkers = (): Action => ({
  type: 'TOGGLE_HELP_MARKERS'
});

export const toggleVideoGamesBubble = (): Action => ({
  type: 'TOGGLE_VIDEO_GAMES_BUBBLE'
});