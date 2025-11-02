import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerNotoSansJp() {
  if (registered) return;
  Font.register({
    family: "Noto Sans JP",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/notosansjp/v52/-F62fjtqLzI2JPCgQBnw7HFQogqWg4SC.ttf",
        fontWeight: 400,
      },
      {
        src: "https://fonts.gstatic.com/s/notosansjp/v52/-F63fjtqLzI2JPCgQBnw7HFQogqWXI6XjQ.ttf",
        fontWeight: 700,
      },
    ],
  });
  registered = true;
}
