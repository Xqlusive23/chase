import { brandMark, type BrandSettings } from "./brand";

function setLink(rel: string, href: string, extras?: { sizes?: string; type?: string }) {
  let link = document.head.querySelector(`link[data-app-icon="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("data-app-icon", rel);
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
  if (extras?.sizes) link.sizes = extras.sizes;
  if (extras?.type) link.type = extras.type;
}

function setMeta(name: string, content: string) {
  let meta = document.head.querySelector(`meta[data-app-icon="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("data-app-icon", name);
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function drawFallback(ctx: CanvasRenderingContext2D, size: number, name: string) {
  ctx.fillStyle = "#0b1f3a";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${Math.round(size * 0.42)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(brandMark(name), size / 2, size / 2 + size * 0.02);
}

async function squareIcon(src: string | undefined, name: string, size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = "#0b1f3a";
  ctx.fillRect(0, 0, size, size);

  if (!src) {
    drawFallback(ctx, size, name);
    return canvas.toDataURL("image/png");
  }

  await new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => {
      const pad = size * 0.16;
      const box = size - pad * 2;
      const scale = Math.min(box / image.width, box / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      resolve();
    };
    image.onerror = () => {
      drawFallback(ctx, size, name);
      resolve();
    };
    image.src = src;
  });

  return canvas.toDataURL("image/png");
}

export async function applyAppIcons(brand: BrandSettings) {
  if (typeof document === "undefined") return;
  const src = brand.logo || undefined;
  const [icon192, icon512] = await Promise.all([
    squareIcon(src, brand.name, 192),
    squareIcon(src, brand.name, 512),
  ]);

  setLink("icon", icon192, { sizes: "192x192", type: "image/png" });
  setLink("apple-touch-icon", icon192, { sizes: "180x180" });
  setMeta("apple-mobile-web-app-capable", "yes");
  setMeta("apple-mobile-web-app-title", brand.name);
  setMeta("theme-color", "#0b1f3a");

  const manifest = {
    name: brand.name,
    short_name: brand.name,
    description: "Personal banking with accounts, payments, and activity in one place.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1f3a",
    theme_color: "#0b1f3a",
    icons: [
      { src: icon192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: icon512, sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
  const previous = document.head.querySelector('link[data-app-icon="manifest"]') as HTMLLinkElement | null;
  if (previous?.href.startsWith("blob:")) URL.revokeObjectURL(previous.href);
  const url = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" }));
  setLink("manifest", url);
}
