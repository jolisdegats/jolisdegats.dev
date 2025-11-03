
// Modal and positioning
export const MODAL_SIZE = 400;
export const VIDEOGAMES_LEFT_POSITION = 38;
export const VIDEOGAMES_TOP_POSITION = 72;

// Book dimensions
export const COVER_HEIGHT = MODAL_SIZE / 2;
export const COVER_WIDTH = (COVER_HEIGHT / 3) * 2;
export const SPINE_WIDTH = 18;
export const NEGATIVE_MARGIN = COVER_WIDTH;

// Animation durations (in milliseconds)
export const UNFOCUS_ROTATE_AND_TRANSLATE_DURATION = 300; // Rotate and translate out
export const UNFOCUS_BACK_TO_SHELF_DURATION = 300; // Translate back to shelf
export const FOCUS_ROTATION_DELAY = 200; // Delay before rotation starts
export const FOCUS_ROTATION_DURATION = 400; // Rotation animation time

// Preview mode delays
export const PREVIEW_START_DELAY = 300; // Delay before preview mode starts
export const PREVIEW_SCROLL_INTERVAL = 300; // Time between preview index changes
export const TOUCH_SWIPE_THRESHOLD = 50; // Minimum swipe distance to register


export const IDLE_ANIMATION_PHASE = 'idle';
export const TAKING_OUT_ANIMATION_PHASE = 'taking-out';
export const ROTATING_WHILE_TAKING_OUT_ANIMATION_PHASE = 'rotating-while-taking-out';
export const CENTERING_ANIMATION_PHASE = 'centering';
export const UNFOCUSING_ROTATE_AND_TRANSLATE_ANIMATION_PHASE = 'unfocusing-rotate-and-translate';
export const TRANSLATE_BACK_TO_SHELF_ANIMATION_PHASE = 'translate-back-to-shelf';
export const ANIMATION_PHASES = [IDLE_ANIMATION_PHASE, TAKING_OUT_ANIMATION_PHASE, ROTATING_WHILE_TAKING_OUT_ANIMATION_PHASE, CENTERING_ANIMATION_PHASE, UNFOCUSING_ROTATE_AND_TRANSLATE_ANIMATION_PHASE, TRANSLATE_BACK_TO_SHELF_ANIMATION_PHASE] as const;
export type AnimationPhase = typeof ANIMATION_PHASES[number];
