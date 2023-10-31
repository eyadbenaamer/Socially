// import { useTheme } from "hooks/useTheme";
// const useHovers = ({ bg, text }) => {
//   const theme = useTheme();
//   const style = {
//     style: {
//       transition: "0.2s",
//     },
//   };
//   const hoverProps = {
//     onMouseOver: (e) => {
//       if (bg) {
//         e.currentTarget.style.background = theme.background.alt;
//       }
//       if (text) {
//         e.currentTarget.style.color = theme.primaryColor;
//         e.currentTarget.classList.add("hovered");
//       }
//     },
//     onMouseLeave: (e) => {
//       if (bg) {
//         e.currentTarget.style.background = null;
//       }
//       if (text) {
//         e.currentTarget.style.color = null;
//         e.currentTarget.classList.remove("hovered");
//       }
//     },
//   };
//   return { ...hoverProps, ...style };
// };
// export default useHovers;
