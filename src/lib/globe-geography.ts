import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

type DrawableTextureSource = CanvasImageSource & {
  width: number;
  height: number;
};

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
