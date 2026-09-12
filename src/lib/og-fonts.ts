/** Loads Inter weights for next/og ImageResponse renders. Falls back to satori's default font when Google Fonts is unreachable. */

const FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@500;800&display=swap";
// Old UA makes Google Fonts serve TTF (satori cannot parse woff2).
const LEGACY_UA = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0";

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 800;
  style: "normal";
}

const fetchFontFile = async (weight: 500 | 800, css: string): Promise<OgFont | null> => {
  const block = css.split("@font-face").find((face) => face.includes(`font-weight: ${weight}`));
  const url = block?.match(/src: url\(([^)]+)\)/)?.[1];
  if (!url) return null;
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) return null;
  return { name: "Inter", data: await response.arrayBuffer(), weight, style: "normal" };
};

export const loadInterFonts = async (): Promise<OgFont[]> => {
  try {
    const cssResponse = await fetch(FONT_CSS_URL, { headers: { "User-Agent": LEGACY_UA }, cache: "force-cache" });
    if (!cssResponse.ok) return [];
    const css = await cssResponse.text();
    const fonts = await Promise.all([fetchFontFile(500, css), fetchFontFile(800, css)]);
    return fonts.filter((font): font is OgFont => font !== null);
  } catch (error) {
    console.warn("Inter font load failed; using default OG font", error);
    return [];
  }
};
