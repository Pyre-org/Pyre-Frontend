import { DEFAULT_THEME, createTheme, mergeMantineTheme } from "@mantine/core";

export const custom_colors = {
  bluegray: [
    "#f3f3fe",
    "#e4e6ed",
    "#c8cad3",
    "#a9adb9",
    "#9093a4",
    "#808496",
    "#767c91",
    "#656a7e",
    "#585e72",
    "#4a5167",
  ],
  paleblue: [
    "#eef3ff",
    "#dce4f5",
    "#b9c7e2",
    "#94a8d0",
    "#748dc1",
    "#5f7cb8",
    "#5474b4",
    "#44639f",
    "#39588f",
    "#2d4b81",
  ],
  darknavy: [
    "#f9fafb",
    "#f3f4f6",
    "#e5e7eb",
    "#d1d5db",
    "#9ca3af",
    "#6b7280",
    "#4b5563",
    "#374151",
    "#1f2937",
    "#111827",
  ],
} as const;

const themeOverides = createTheme({
  colors: custom_colors,
  primaryColor: "bluegray",
  cursorType: "pointer",
  components: {
    Menu: {
      classNames: {
        dropdown: {
          backgroundColor: "bg-gray-800",
        },
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverides);
