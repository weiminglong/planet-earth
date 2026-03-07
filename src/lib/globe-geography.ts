import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

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
