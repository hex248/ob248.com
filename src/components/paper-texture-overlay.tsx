import { PaperTexture } from "@paper-design/shaders-react";
import { useTheme } from "@/components/theme-provider";

const lightTexture = {
  colorFront: "#5f4a331a",
  contrast: 0.3,
  roughness: 0.24,
  fiber: 0.1,
  crumples: 0,
  folds: 0,
  drops: 0,
};

const darkTexture = {
  colorFront: "#f6efe31a",
  contrast: 0.3,
  roughness: 0.24,
  fiber: 0.1,
  crumples: 0,
  folds: 0,
  drops: 0,
};

export function PaperTextureOverlay() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const texture = isDark ? darkTexture : lightTexture;

  return (
    <PaperTexture
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-dvh w-full"
      width="100%"
      height="100%"
      speed={0}
      fit="cover"
      scale={0.6}
      colorBack="#00000000"
      colorFront={texture.colorFront}
      contrast={texture.contrast}
      roughness={texture.roughness}
      fiber={texture.fiber}
      fiberSize={0.22}
      crumples={texture.crumples}
      crumpleSize={0.35}
      folds={texture.folds}
      foldCount={5}
      drops={texture.drops}
      fade={0.08}
      seed={5}
      minPixelRatio={1}
      maxPixelCount={2304000}
    />
  );
}
