import {
  makeColorBucketTheme,
  makeColorMap,
  makeStackToColor,
} from 'sentry/utils/profiling/colors/utils';
import {FlamegraphFrame} from 'sentry/utils/profiling/flamegraphFrame';
import {Frame} from 'sentry/utils/profiling/frame';
import {darkTheme, lightTheme} from 'sentry/utils/theme';

const MONOSPACE_FONT = `ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono',
'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono',
'Courier New', monospace`;

const FRAME_FONT = lightTheme.text.familyMono;

// Luma chroma hue settings
export interface LCH {
  C_0: number;
  C_d: number;
  L_0: number;
  L_d: number;
}
// Color can be rgb or rgba. I want to probably eliminate rgb and just use rgba, but we would be allocating 25% more memory,
// and I'm not sure about the impact we'd need. There is a tradeoff between memory and runtime performance checks that I'll need to evaluate at some point.
export type ColorChannels = [number, number, number] | [number, number, number, number];

export interface FlamegraphTheme {
  // @TODO, most colors are defined as strings, which is a mistake as we loose a lot of functionality and impose constraints.
  // They should instead be defined as arrays of numbers so we can use them with glsl and avoid unnecessary parsing
  COLORS: {
    BAR_LABEL_FONT_COLOR: string;
    COLOR_BUCKET: (t: number) => ColorChannels;
    COLOR_MAP: (
      frames: ReadonlyArray<FlamegraphFrame>,
      colorBucket: FlamegraphTheme['COLORS']['COLOR_BUCKET'],
      sortByKey?: (a: FlamegraphFrame, b: FlamegraphFrame) => number
    ) => Map<FlamegraphFrame['frame']['key'], ColorChannels>;
    CURSOR_CROSSHAIR: string;
    DIFFERENTIAL_DECREASE: ColorChannels;
    DIFFERENTIAL_INCREASE: ColorChannels;
    FOCUSED_FRAME_BORDER_COLOR: string;
    FRAME_FALLBACK_COLOR: [number, number, number, number];
    GRID_FRAME_BACKGROUND_COLOR: string;
    GRID_LINE_COLOR: string;
    HIGHLIGHTED_LABEL_COLOR: ColorChannels;
    HOVERED_FRAME_BORDER_COLOR: string;
    LABEL_FONT_COLOR: string;
    MINIMAP_POSITION_OVERLAY_BORDER_COLOR: string;
    MINIMAP_POSITION_OVERLAY_COLOR: string;
    // Nice color picker for GLSL colors - https://keiwando.com/color-picker/
    SAMPLE_TICK_COLOR: ColorChannels;
    SEARCH_RESULT_FRAME_COLOR: string;
    SEARCH_RESULT_SPAN_COLOR: string;
    SELECTED_FRAME_BORDER_COLOR: string;
    SPAN_COLOR_BUCKET: (t: number) => ColorChannels;
    SPAN_FALLBACK_COLOR: [number, number, number, number];
    SPAN_FRAME_BORDER: string;
    SPAN_FRAME_LINE_PATTERN: string;
    SPAN_FRAME_LINE_PATTERN_BACKGROUND: string;
    STACK_TO_COLOR: (
      frames: ReadonlyArray<FlamegraphFrame>,
      colorMapFn: FlamegraphTheme['COLORS']['COLOR_MAP'],
      colorBucketFn: FlamegraphTheme['COLORS']['COLOR_BUCKET']
    ) => {
      colorBuffer: Array<number>;
      colorMap: Map<Frame['key'], ColorChannels>;
    };
  };
  FONTS: {
    FONT: string;
    FRAME_FONT: string;
  };
  SIZES: {
    BAR_FONT_SIZE: number;
    BAR_HEIGHT: number;
    BAR_PADDING: number;
    FLAMEGRAPH_DEPTH_OFFSET: number;
    FOCUSED_FRAME_BORDER_WIDTH: number;
    FRAME_BORDER_WIDTH: number;
    GRID_LINE_WIDTH: number;
    HOVERED_FRAME_BORDER_WIDTH: number;
    INTERNAL_SAMPLE_TICK_LINE_WIDTH: number;
    LABEL_FONT_PADDING: number;
    LABEL_FONT_SIZE: number;
    MINIMAP_HEIGHT: number;
    MINIMAP_POSITION_OVERLAY_BORDER_WIDTH: number;
    SPANS_BAR_HEIGHT: number;
    SPANS_DEPTH_OFFSET: number;
    SPANS_FONT_SIZE: number;
    SPANS_HEIGHT: number;
    TIMELINE_HEIGHT: number;
    TOOLTIP_FONT_SIZE: number;
    UI_FRAMES_HEIGHT: number;
  };
}

// Luma chroma hue settings for light theme
export const LCH_LIGHT = {
  C_0: 0.25,
  C_d: 0.2,
  L_0: 0.8,
  L_d: 0.15,
};

// Luma chroma hue settings for dark theme
export const LCH_DARK = {
  C_0: 0.2,
  C_d: 0.1,
  L_0: 0.2,
  L_d: 0.1,
};

const SPAN_LCH_LIGHT = {
  C_0: 0.3,
  C_d: 0.25,
  L_0: 0.8,
  L_d: 0.15,
};

const SPANS_LCH_DARK = {
  C_0: 0.3,
  C_d: 0.15,
  L_0: 0.2,
  L_d: 0.1,
};

const SIZES: FlamegraphTheme['SIZES'] = {
  BAR_FONT_SIZE: 11,
  BAR_HEIGHT: 20,
  BAR_PADDING: 4,
  FLAMEGRAPH_DEPTH_OFFSET: 12,
  FOCUSED_FRAME_BORDER_WIDTH: 2,
  FRAME_BORDER_WIDTH: 2,
  GRID_LINE_WIDTH: 2,
  HOVERED_FRAME_BORDER_WIDTH: 1,
  INTERNAL_SAMPLE_TICK_LINE_WIDTH: 1,
  LABEL_FONT_PADDING: 6,
  LABEL_FONT_SIZE: 10,
  MINIMAP_HEIGHT: 100,
  MINIMAP_POSITION_OVERLAY_BORDER_WIDTH: 2,
  SPANS_BAR_HEIGHT: 20,
  SPANS_DEPTH_OFFSET: 6,
  SPANS_FONT_SIZE: 11,
  SPANS_HEIGHT: 160,
  TIMELINE_HEIGHT: 20,
  TOOLTIP_FONT_SIZE: 12,
  UI_FRAMES_HEIGHT: 60,
};

const FONTS: FlamegraphTheme['FONTS'] = {
  FONT: MONOSPACE_FONT,
  FRAME_FONT,
};

export const LightFlamegraphTheme: FlamegraphTheme = {
  SIZES,
  COLORS: {
    BAR_LABEL_FONT_COLOR: '#000',
    COLOR_BUCKET: makeColorBucketTheme(LCH_LIGHT),
    SPAN_COLOR_BUCKET: makeColorBucketTheme(SPAN_LCH_LIGHT, 140, 220),
    COLOR_MAP: makeColorMap,
    CURSOR_CROSSHAIR: '#bbbbbb',
    DIFFERENTIAL_DECREASE: [0.309, 0.2058, 0.98],
    DIFFERENTIAL_INCREASE: [0.98, 0.2058, 0.4381],
    FOCUSED_FRAME_BORDER_COLOR: lightTheme.focus,
    FRAME_FALLBACK_COLOR: [0, 0, 0, 0.1],
    SPAN_FALLBACK_COLOR: [0, 0, 0, 0.1],
    GRID_FRAME_BACKGROUND_COLOR: 'rgba(255, 255, 255, 0.8)',
    GRID_LINE_COLOR: '#e5e7eb',
    HIGHLIGHTED_LABEL_COLOR: [255, 255, 0],
    HOVERED_FRAME_BORDER_COLOR: 'rgba(0, 0, 0, 0.8)',
    LABEL_FONT_COLOR: '#1f233a',
    MINIMAP_POSITION_OVERLAY_BORDER_COLOR: 'rgba(0,0,0, 0.2)',
    MINIMAP_POSITION_OVERLAY_COLOR: 'rgba(0,0,0,0.1)',
    SAMPLE_TICK_COLOR: [255, 0, 0, 0.5],
    SEARCH_RESULT_FRAME_COLOR: 'vec4(0.99, 0.70, 0.35, 1.0)',
    SEARCH_RESULT_SPAN_COLOR: '#fdb359',
    SELECTED_FRAME_BORDER_COLOR: lightTheme.blue400,
    SPAN_FRAME_LINE_PATTERN: '#dedae3',
    SPAN_FRAME_LINE_PATTERN_BACKGROUND: '#f4f2f7',
    SPAN_FRAME_BORDER: 'rgba(200, 200, 200, 1)',
    STACK_TO_COLOR: makeStackToColor([0, 0, 0, 0.035]),
  },
  FONTS,
};

export const DarkFlamegraphTheme: FlamegraphTheme = {
  SIZES,
  COLORS: {
    BAR_LABEL_FONT_COLOR: 'rgb(255 255 255 / 80%)',
    COLOR_BUCKET: makeColorBucketTheme(LCH_DARK),
    SPAN_COLOR_BUCKET: makeColorBucketTheme(SPANS_LCH_DARK, 140, 220),
    COLOR_MAP: makeColorMap,
    CURSOR_CROSSHAIR: '#828285',
    DIFFERENTIAL_DECREASE: [0.309, 0.2058, 0.98],
    DIFFERENTIAL_INCREASE: [0.98, 0.2058, 0.4381],
    FOCUSED_FRAME_BORDER_COLOR: darkTheme.focus,
    FRAME_FALLBACK_COLOR: [1, 1, 1, 0.3],
    SPAN_FALLBACK_COLOR: [1, 1, 1, 0.3],
    GRID_FRAME_BACKGROUND_COLOR: 'rgba(0, 0, 0, 0.4)',
    GRID_LINE_COLOR: '#222227',
    HIGHLIGHTED_LABEL_COLOR: [255, 255, 0],
    HOVERED_FRAME_BORDER_COLOR: 'rgba(255, 255, 255, 0.8)',
    LABEL_FONT_COLOR: 'rgba(255, 255, 255, 0.8)',
    MINIMAP_POSITION_OVERLAY_BORDER_COLOR: 'rgba(255,255,255, 0.2)',
    MINIMAP_POSITION_OVERLAY_COLOR: 'rgba(255,255,255,0.1)',
    SAMPLE_TICK_COLOR: [255, 0, 0, 0.5],
    SEARCH_RESULT_FRAME_COLOR: 'vec4(0.99, 0.70, 0.35, 0.7)',
    SPAN_FRAME_LINE_PATTERN: '#594b66',
    SPAN_FRAME_LINE_PATTERN_BACKGROUND: '#1a1724',
    SELECTED_FRAME_BORDER_COLOR: lightTheme.blue400,
    SEARCH_RESULT_SPAN_COLOR: '#b9834a',
    SPAN_FRAME_BORDER: '#57575b',
    STACK_TO_COLOR: makeStackToColor([1, 1, 1, 0.1]),
  },
  FONTS,
};
