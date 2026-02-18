import { Vibrant } from "node-vibrant/node";

export default async function handler(req: any, res: any) {
  let path = req.body;
  if (!path.startsWith("https")) path = `public${req.body}`;

  Vibrant.from(path)
    .getPalette()
    .then((palette: any) => {
      let bg = [0, 0, 0];
      let fg = [0, 0, 1];

      const vibrant =
        palette.Vibrant._population > palette.Muted._population + 600;
      if (vibrant) {
        bg = palette.Vibrant._hsl;
      } else if (palette.Muted._population > 0) {
        bg = palette.Muted._hsl;
      }

      fg = contrast(bg[0], bg[1], bg[2] * 100);

      const hex = convertToHexFromHSL(bg[0] * 360, bg[1] * 100, bg[2] * 100);

      const oppositeHex = convertToHexFromHSL(
        fg[0] * 360,
        fg[1] * 100,
        fg[2] * 100,
      );

      res.send({
        hex: hex,
        oppositeHex: oppositeHex,
      });
    });
}

const convertToHexFromHSL = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const contrast = (h: number, s: number, l: number) => {
  // let oppositeHue = (h + 180) % 360;

  const oppositeLightness = l < 50 ? l + 50 : l - 50;
  return [h, s, oppositeLightness / 100];
};
