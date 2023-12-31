import { deepmerge } from '@mui/utils';
import type { Theme } from '@mui/material';
import { createTheme, colors } from '@mui/material';

const GlobalTheme: Partial<Theme> = {
  typography: {
    fontFamily: 'inherit',
  } as Theme['typography'],
  components: {
    MuiToolbar: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiLink: {
      defaultProps: {
        color: colors.blue[500],
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 3,
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
        variant: 'rounded',
      },
    },
  },
};

export const LightTheme = createTheme(
  deepmerge(GlobalTheme, {
    palette: {
      mode: 'light',
      primary: {
        light: colors.blue[300],
        main: colors.blue[500],
        dark: colors.blue[700],
        contrastText: colors.common.white,
      },
      secondary: {
        light: colors.pink[300],
        main: colors.pink[500],
        dark: colors.pink[700],
        contrastText: colors.common.white,
      },
    },
  }),
);

export const DarkTheme = createTheme(
  deepmerge(GlobalTheme, {
    palette: {
      mode: 'dark',
      primary: {
        light: colors.grey[700],
        main: colors.grey[800],
        dark: colors.grey[900],
        contrastText: colors.common.white,
      },
      secondary: {
        light: colors.pink[300],
        main: colors.pink[500],
        dark: colors.pink[700],
        contrastText: colors.common.white,
      },
    },
  }),
);
