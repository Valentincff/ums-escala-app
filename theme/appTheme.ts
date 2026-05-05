import { Platform } from "react-native";

export const theme = {
  colors: {
    background: "#eef3f9",
    surface: "#ffffff",
    surfaceMuted: "#f6f9fd",
    primary: "#1d5fd0",
    primaryStrong: "#184caa",
    accent: "#2f7cf3",
    accentSoft: "#e8f0fb",
    text: "#20406a",
    textSecondary: "#637a99",
    textMuted: "#8aa0bf",
    border: "#d9e3ef",
    success: "#1f8a5b",
    warning: "#a56b00",
    danger: "#bf3f46",
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    pill: 999,
  },
  shadowCard: Platform.select({
    ios: {
      shadowColor: "#173a72",
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
};
