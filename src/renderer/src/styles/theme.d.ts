import { DefaultMantineColor, MantineColorsTuple } from "@mantine/core";
import { custom_colors } from "../styles/theme";

type ExtendedCustomColors = keyof typeof custom_colors | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}
