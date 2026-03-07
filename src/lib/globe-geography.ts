import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

type DrawableTextureSource = CanvasImageSource & {
  width: number;
  height: number;
};

type RgbColor = [number, number, number];

export function createModernEarthTexture(source: DrawableTextureSource) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a 2D context for the Earth texture.");
  }

  context.filter = "brightness(0.82) contrast(1.1) saturate(0.86) hue-rotate(4deg)";
  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "multiply";
  context.fillStyle = "rgba(6, 18, 34, 0.24)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = "soft-light";
  context.fillStyle = "rgba(58, 130, 246, 0.16)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const equatorialGlow = context.createLinearGradient(0, 0, 0, canvas.height);
  equatorialGlow.addColorStop(0, "rgba(255,255,255,0)");
  equatorialGlow.addColorStop(0.32, "rgba(34, 211, 238, 0.06)");
  equatorialGlow.addColorStop(0.52, "rgba(96, 165, 250, 0.14)");
  equatorialGlow.addColorStop(0.72, "rgba(34, 211, 238, 0.05)");
  equatorialGlow.addColorStop(1, "rgba(255,255,255,0)");
  context.globalCompositeOperation = "screen";
  context.fillStyle = equatorialGlow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const polarFade = context.createLinearGradient(0, 0, 0, canvas.height);
  polarFade.addColorStop(0, "rgba(3, 7, 18, 0.18)");
  polarFade.addColorStop(0.14, "rgba(3, 7, 18, 0.02)");
  polarFade.addColorStop(0.86, "rgba(3, 7, 18, 0.02)");
  polarFade.addColorStop(1, "rgba(3, 7, 18, 0.2)");
  context.globalCompositeOperation = "multiply";
  context.fillStyle = polarFade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}

export function createAppleMapTexture(
  source: DrawableTextureSource,
  reliefSource?: DrawableTextureSource,
) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a 2D context for the Apple-style Earth texture.");
  }

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = source.width;
  sourceCanvas.height = source.height;
  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext) {
    throw new Error("Unable to create an intermediate context for the Apple-style texture.");
  }

  sourceContext.drawImage(source, 0, 0, source.width, source.height);
  const sourcePixels = sourceContext.getImageData(0, 0, source.width, source.height);

  const reliefPixels = reliefSource
    ? (() => {
        const reliefCanvas = document.createElement("canvas");
        reliefCanvas.width = reliefSource.width;
        reliefCanvas.height = reliefSource.height;
        const reliefContext = reliefCanvas.getContext("2d");

        if (!reliefContext) {
          return null;
        }

        reliefContext.drawImage(reliefSource, 0, 0, reliefSource.width, reliefSource.height);
        return reliefContext.getImageData(0, 0, reliefSource.width, reliefSource.height);
      })()
    : null;

  const output = context.createImageData(source.width, source.height);

  for (let offset = 0; offset < sourcePixels.data.length; offset += 4) {
    const red = sourcePixels.data[offset] / 255;
    const green = sourcePixels.data[offset + 1] / 255;
    const blue = sourcePixels.data[offset + 2] / 255;
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;

    const waterLike = blue > green * 0.98 && blue > red * 1.05 && luminance < 0.78;
    const polarLike =
      luminance > 0.82 &&
      Math.abs(red - green) < 0.06 &&
      Math.abs(green - blue) < 0.06;
    const desertLike = red > green * 1.04 && green > blue * 1.02 && luminance > 0.45;
    const vegetationLike = green > red * 0.98 && green > blue * 1.08;

    let color: RgbColor;

    if (waterLike) {
      const depth = clamp((0.76 - luminance) / 0.52, 0, 1);
      color = mixRgb([185, 211, 232], [123, 166, 205], depth);
    } else if (polarLike) {
      color = mixRgb([244, 247, 250], [229, 236, 243], clamp((luminance - 0.82) / 0.18, 0, 1));
    } else if (desertLike) {
      color = mixRgb([227, 217, 202], [208, 194, 175], clamp((red - blue) * 1.5, 0, 1));
    } else if (vegetationLike) {
      color = mixRgb([210, 219, 205], [192, 207, 190], clamp((green - blue) * 1.2, 0, 1));
    } else {
      color = mixRgb([227, 230, 222], [209, 214, 208], clamp((0.6 - luminance) * 1.4, 0, 1));
    }

    if (!waterLike && reliefPixels) {
      const reliefRed = reliefPixels.data[offset];
      const reliefGreen = reliefPixels.data[offset + 1];
      const reliefBlue = reliefPixels.data[offset + 2];
      const reliefStrength = clamp(
        (Math.abs(reliefRed - 128) + Math.abs(reliefGreen - 128) + Math.abs(reliefBlue - 255)) /
          170,
        0,
        1,
      );
      const highlight = reliefGreen > 128 ? reliefStrength * 0.06 : -reliefStrength * 0.08;
      color = applyLightness(color, highlight);
    }

    output.data[offset] = color[0];
    output.data[offset + 1] = color[1];
    output.data[offset + 2] = color[2];
    output.data[offset + 3] = sourcePixels.data[offset + 3];
  }

  context.putImageData(output, 0, 0);

  const oceanGlow = context.createLinearGradient(0, 0, 0, canvas.height);
  oceanGlow.addColorStop(0, "rgba(255,255,255,0)");
  oceanGlow.addColorStop(0.36, "rgba(255,255,255,0.05)");
  oceanGlow.addColorStop(0.52, "rgba(255,255,255,0.08)");
  oceanGlow.addColorStop(0.68, "rgba(255,255,255,0.05)");
  oceanGlow.addColorStop(1, "rgba(255,255,255,0)");
  context.globalCompositeOperation = "screen";
  context.fillStyle = oceanGlow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glassShade = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  glassShade.addColorStop(0, "rgba(255,255,255,0.1)");
  glassShade.addColorStop(0.45, "rgba(255,255,255,0)");
  glassShade.addColorStop(1, "rgba(14, 26, 43, 0.14)");
  context.globalCompositeOperation = "soft-light";
  context.fillStyle = glassShade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}

export function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a 2D context for the cloud texture.");
  }

  const cloudBands = [
    { x: 0.24, y: 0.28, width: 0.18, height: 0.06, alpha: 0.18 },
    { x: 0.46, y: 0.32, width: 0.22, height: 0.07, alpha: 0.16 },
    { x: 0.68, y: 0.27, width: 0.2, height: 0.065, alpha: 0.18 },
    { x: 0.2, y: 0.62, width: 0.16, height: 0.05, alpha: 0.12 },
    { x: 0.54, y: 0.58, width: 0.24, height: 0.07, alpha: 0.15 },
    { x: 0.82, y: 0.63, width: 0.14, height: 0.05, alpha: 0.11 },
  ];

  cloudBands.forEach((band) => {
    context.save();
    context.translate(band.x * canvas.width, band.y * canvas.height);
    context.rotate(-0.18);
    const gradient = context.createRadialGradient(
      0,
      0,
      6,
      0,
      0,
      band.width * canvas.width,
    );
    gradient.addColorStop(0, `rgba(255,255,255,${band.alpha})`);
    gradient.addColorStop(0.55, `rgba(255,255,255,${band.alpha * 0.55})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.ellipse(
      0,
      0,
      band.width * canvas.width,
      band.height * canvas.height,
      0,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.restore();
  });

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mixRgb(from: RgbColor, to: RgbColor, amount: number): RgbColor {
  return [
    Math.round(from[0] + (to[0] - from[0]) * amount),
    Math.round(from[1] + (to[1] - from[1]) * amount),
    Math.round(from[2] + (to[2] - from[2]) * amount),
  ];
}

function applyLightness(color: RgbColor, amount: number): RgbColor {
  return [
    Math.round(clamp(color[0] * (1 + amount), 0, 255)),
    Math.round(clamp(color[1] * (1 + amount), 0, 255)),
    Math.round(clamp(color[2] * (1 + amount), 0, 255)),
  ];
}
