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
  return prepareBrandHeaderImage(dataUrl, maxWidth, false);
}

export async function prepareBrandHeaderImage(dataUrl: string | undefined, maxWidth = 360, whiten = true): Promise<string> {
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
      if (whiten) {
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = pixels.data;
        for (let index = 0; index < data.length; index += 4) {
          const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
          if (data[index + 3] < 12) continue;
          if (brightness > 235) {
            data[index + 3] = 0;
            continue;
          }
          data[index] = 255;
          data[index + 1] = 255;
          data[index + 2] = 255;
        }
        context.putImageData(pixels, 0, 0);
      }
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}
