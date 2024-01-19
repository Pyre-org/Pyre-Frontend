import { DEFAULT_THEME, createTheme, mergeMantineTheme } from "@mantine/core";

const themeOverides = createTheme({});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverides);
