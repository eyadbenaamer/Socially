import { useMemo } from "react";
import { useSelector } from "react-redux";
export const useThemes = () => {
  const mode = useSelector((state) => state.settings.mode);
  const theme = useMemo(() => {
    if (mode === "dark") {
      return {
        primaryColor: "#4361ee",
        secondaryColor: "#899dfc",
        background: {
          100: "#171923",
          200: "#212330",
          300: "#2a2d3d",
          alt: "#303343",
        },
      };
    } else if (mode === "light") {
      return {
        primaryColor: "#4361ee",
        secondaryColor: "#899dfc",
        background: {
          100: " #f4f5f9",
          200: "#ffffff",
          300: "#fafbff" || "#edededb8",
          alt: "#eaedfb",
        },
      };
    }
  }, [mode]);
  return theme;
};
