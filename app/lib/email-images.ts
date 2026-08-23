import { findUsBank } from "./us-banks";

export type InlineImage = {
  filename: string;
  content: string;
  contentId: string;
  contentType?: string;
};

function parseDataUrl(value: string): { content: string; contentType: string } | null {
  const match = value.trim().match(/^data:([^;,]+)?(?:;charset=[^;]+)?;base64,([\s\S]+)$/i);
  if (!match?.[2]) return null;
  return { contentType: match[1] || "image/png", content: match[2].replace(/\s/g, "") };
}

export function dataUrlToBytes(value: string | undefined) {
  if (!value?.startsWith("data:")) return null;
  const parsed = parseDataUrl(value);
  if (!parsed || parsed.content.length < 32) return null;
  return {
    contentType: parsed.contentType,
    content: Buffer.from(parsed.content, "base64"),
  };
}

export function inlineFromDataUrl(value: string | undefined, contentId: string, filename: string): InlineImage | null {
  if (!value?.startsWith("data:")) return null;
  const parsed = parseDataUrl(value);
  if (!parsed || parsed.content.length < 32) return null;
  return {
    filename,
    content: parsed.content,
    contentId,
    contentType: parsed.contentType,
  };
}

export function publicBankLogoUrl(name?: string) {
  const bank = name ? findUsBank(name) : undefined;
  if (bank?.domain) {
    return `https://www.google.com/s2/favicons?sz=128&domain=${bank.domain}`;
  }
  const label = encodeURIComponent((name || "Bank").replace(/\s+/g, " ").trim());
  return `https://ui-avatars.com/api/?name=${label}&background=0D5CAB&color=fff&bold=true&size=128&format=png`;
}

export async function shrinkDataImage(dataUrl: string | undefined, maxWidth = 360): Promise<string> {
  return prepareBrandHeaderImage(dataUrl, maxWidth, "none");
}

export async function prepareSenderLogo(dataUrl: string | undefined, size = 192): Promise<string> {
  if (!dataUrl?.startsWith("data:") || typeof document === "undefined") return dataUrl || "";
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(dataUrl);
        return;
      }
      context.clearRect(0, 0, size, size);
      const pad = size * 0.1;
      const box = size - pad * 2;
      const scale = Math.min(box / Math.max(image.width, 1), box / Math.max(image.height, 1));
      const width = image.width * scale;
      const height = image.height * scale;
      context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

export async function prepareBrandHeaderImage(
  dataUrl: string | undefined,
  maxWidth = 360,
  tone: "white" | "navy" | "none" | boolean = "white"
): Promise<string> {
  const mode = tone === true ? "white" : tone === false ? "none" : tone;
  if (!dataUrl?.startsWith("data:") || typeof document === "undefined") return dataUrl || "";
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxWidth / Math.max(image.width, 1));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(dataUrl);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (mode !== "none") {
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = pixels.data;
        for (let index = 0; index < data.length; index += 4) {
          const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
          if (data[index + 3] < 12) continue;
          if (mode === "white") {
            if (brightness > 235) {
              data[index + 3] = 0;
              continue;
            }
            data[index] = 255;
            data[index + 1] = 255;
            data[index + 2] = 255;
          } else {
            if (brightness > 245 && data[index + 3] < 40) continue;
            data[index] = 0;
            data[index + 1] = 46;
            data[index + 2] = 109;
          }
        }
        context.putImageData(pixels, 0, 0);
      }
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}
