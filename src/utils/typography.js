import Typography from "typography";

const typography = new Typography({ 
  baseFontSize: "18px",
  googleFonts: [
    {
      name: "Roboto",
      styles: [
        "100",
        "200",
        "300",
        "400",
        "700",
      ],
    },
      {
      name: "Roboto Condensed",
      styles: [
        "100",
        "200",
        "300",
        "400",
        "700",
      ]
    }
  ],
  headerFontFamily: ["Roboto Condensed"],
  bodyFontFamily: ["Roboto"],
});

export default typography;