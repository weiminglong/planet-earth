import { CanvasTexture, LinearFilter, SRGBColorSpace } from "three";

type GlobePolygon = {
  fill: string;
  stroke: string;
  points: Array<[lng: number, lat: number]>;
};

const LAND_POLYGONS: GlobePolygon[] = [
  {
    fill: "#6b8e5b",
    stroke: "rgba(219, 252, 198, 0.55)",
    points: [
      [-168, 70],
      [-152, 72],
      [-140, 68],
      [-128, 57],
      [-123, 50],
      [-118, 43],
      [-112, 33],
      [-104, 28],
      [-96, 24],
      [-90, 19],
      [-85, 20],
      [-83, 25],
      [-82, 30],
      [-87, 34],
      [-96, 44],
      [-110, 55],
      [-126, 60],
      [-140, 63],
      [-154, 64],
      [-164, 60],
      [-168, 70],
    ],
  },
  {
    fill: "#86b96e",
    stroke: "rgba(236, 253, 245, 0.5)",
    points: [
      [-82, 12],
      [-74, 7],
      [-69, -5],
      [-66, -14],
      [-64, -24],
      [-62, -34],
      [-64, -45],
      [-70, -54],
      [-75, -53],
      [-78, -42],
      [-79, -25],
      [-78, -10],
      [-80, 3],
      [-82, 12],
    ],
  },
  {
    fill: "#c7b36f",
    stroke: "rgba(255, 243, 196, 0.5)",
    points: [
      [-10, 36],
      [2, 43],
      [16, 49],
      [36, 55],
      [60, 58],
      [86, 62],
      [110, 56],
      [135, 50],
      [154, 56],
      [165, 66],
      [175, 68],
      [160, 44],
      [135, 33],
      [118, 24],
      [104, 12],
      [88, 9],
      [80, 20],
      [68, 25],
      [56, 30],
      [45, 33],
      [34, 40],
      [26, 45],
      [15, 44],
      [4, 40],
      [-6, 38],
      [-10, 36],
    ],
  },
  {
    fill: "#8cae61",
    stroke: "rgba(240, 253, 244, 0.45)",
    points: [
      [-18, 35],
      [-2, 37],
      [12, 33],
      [24, 24],
      [34, 11],
      [40, -2],
      [36, -16],
      [31, -29],
      [22, -35],
      [12, -34],
      [3, -25],
      [-4, -10],
      [-10, 5],
      [-15, 18],
      [-18, 35],
    ],
  },
  {
    fill: "#d38f53",
    stroke: "rgba(255, 237, 213, 0.48)",
    points: [
      [112, -10],
      [126, -16],
      [141, -21],
      [153, -28],
      [153, -37],
      [144, -43],
      [130, -40],
      [119, -32],
      [112, -22],
      [112, -10],
    ],
  },
  {
    fill: "#dceba8",
    stroke: "rgba(248, 250, 252, 0.5)",
    points: [
      [-72, 60],
      [-48, 60],
      [-28, 70],
      [-24, 78],
      [-38, 84],
      [-58, 81],
      [-72, 72],
      [-72, 60],
    ],
  },
  {
    fill: "#87a85d",
    stroke: "rgba(226, 232, 240, 0.42)",
    points: [
      [46, -13],
      [50, -17],
      [51, -22],
      [49, -26],
      [46, -24],
      [44, -19],
      [46, -13],
    ],
  },
  {
    fill: "#9ebe78",
    stroke: "rgba(241, 245, 249, 0.46)",
    points: [
      [129, 33],
      [136, 34],
      [144, 41],
      [142, 45],
      [136, 43],
      [131, 37],
      [129, 33],
    ],
  },
  {
    fill: "#90b67c",
    stroke: "rgba(241, 245, 249, 0.4)",
    points: [
      [166, -35],
      [173, -37],
      [178, -44],
      [171, -47],
      [166, -43],
      [166, -35],
    ],
  },
  {
    fill: "#dfe9f4",
    stroke: "rgba(255, 255, 255, 0.4)",
    points: [
      [-180, -70],
      [-140, -74],
      [-90, -76],
      [-20, -78],
      [40, -76],
      [96, -74],
      [152, -72],
      [180, -69],
      [180, -90],
      [-180, -90],
      [-180, -70],
    ],
  },
];

const RELIEF_SWATHS = [
  { x: 0.34, y: 0.38, width: 0.11, height: 0.03, color: "rgba(255,255,255,0.07)" },
  { x: 0.56, y: 0.34, width: 0.18, height: 0.035, color: "rgba(255,214,170,0.08)" },
  { x: 0.66, y: 0.54, width: 0.14, height: 0.04, color: "rgba(255,245,230,0.05)" },
  { x: 0.78, y: 0.69, width: 0.09, height: 0.03, color: "rgba(255,232,170,0.06)" },
];

export function createGlobeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a 2D context for the globe texture.");
  }

  const width = canvas.width;
  const height = canvas.height;
  const oceanGradient = context.createLinearGradient(0, 0, 0, height);
  oceanGradient.addColorStop(0, "#09172d");
  oceanGradient.addColorStop(0.42, "#113a5f");
  oceanGradient.addColorStop(0.7, "#0b2745");
  oceanGradient.addColorStop(1, "#071224");
  context.fillStyle = oceanGradient;
  context.fillRect(0, 0, width, height);

  const equatorialGlow = context.createLinearGradient(0, 0, 0, height);
  equatorialGlow.addColorStop(0, "rgba(255,255,255,0)");
  equatorialGlow.addColorStop(0.35, "rgba(17, 198, 255, 0.1)");
  equatorialGlow.addColorStop(0.5, "rgba(59, 130, 246, 0.14)");
  equatorialGlow.addColorStop(0.65, "rgba(17, 198, 255, 0.08)");
  equatorialGlow.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = equatorialGlow;
  context.fillRect(0, 0, width, height);

  for (let index = 0; index < 18; index += 1) {
    context.strokeStyle = `rgba(148, 197, 255, ${0.05 + index * 0.002})`;
    context.lineWidth = 1;
    const y = (height / 18) * index;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  for (let index = 0; index < 24; index += 1) {
    context.strokeStyle = "rgba(148, 197, 255, 0.03)";
    context.lineWidth = 1;
    const x = (width / 24) * index;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  LAND_POLYGONS.forEach((polygon) => {
    context.save();
    tracePolygon(context, polygon.points, width, height);
    context.shadowColor = "rgba(110, 231, 183, 0.26)";
    context.shadowBlur = 22;
    context.fillStyle = polygon.fill;
    context.fill();
    context.shadowBlur = 0;
    context.lineWidth = 3;
    context.strokeStyle = polygon.stroke;
    context.stroke();
    context.restore();
  });

  RELIEF_SWATHS.forEach((swath) => {
    context.save();
    context.translate(swath.x * width, swath.y * height);
    context.rotate(-0.22);
    context.fillStyle = swath.color;
    context.beginPath();
    context.ellipse(0, 0, swath.width * width, swath.height * height, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });

  for (let index = 0; index < 110; index += 1) {
    const x = ((index * 173) % width) + (index % 7) * 6;
    const y = ((index * 97) % height) + (index % 5) * 5;
    const radius = 1 + (index % 3);
    context.fillStyle = `rgba(255,255,255,${0.03 + (index % 4) * 0.015})`;
    context.beginPath();
    context.arc(x % width, y % height, radius, 0, Math.PI * 2);
    context.fill();
  }

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

function tracePolygon(
  context: CanvasRenderingContext2D,
  points: Array<[lng: number, lat: number]>,
  width: number,
  height: number,
) {
  context.beginPath();

  points.forEach(([lng, lat], index) => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;

    if (index === 0) {
      context.moveTo(x, y);
      return;
    }

    context.lineTo(x, y);
  });

  context.closePath();
}
