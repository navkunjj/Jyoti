/**
 * Jyoti Diwali Greeting Card Canvas Renderer & Exporter
 * Generates ultra-crisp 1080x1080 PNG greeting cards matching the approved visual reference.
 */

export interface CardRenderData {
  to: string;
  message: string;
  from: string;
}

export async function renderCardToBlob(data: CardRenderData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      reject(new Error('Canvas 2D context unavailable'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/diwali-card-base-1080.jpg';

    img.onload = async () => {
      try {
        if ('fonts' in document) {
          await (document as any).fonts.ready;
        }
      } catch {
        // Fallback gracefully if font loading check fails
      }

      // 1. Draw base high-res artwork
      ctx.drawImage(img, 0, 0, 1080, 1080);

      // Smooth text rendering settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 2. Render 'To' Recipient Name (only if user provided one)
      const toText = data.to.trim();
      if (toText) {
        const toLen = toText.length;
        const toFontSize = toLen <= 10 ? 46 : toLen <= 16 ? 38 : 30;
        ctx.font = `italic 600 ${toFontSize}px "Playfair Display", "Cormorant Garamond", Georgia, serif`;
        ctx.fillStyle = '#2A1618';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(toText, 690, 285);
      }

      // 3. Render Custom Wish Message (only if changed from base card artwork)
      const defaultWish =
        'May this Diwali bring happiness, good health, prosperity, and new beginnings into your life.';
      const rawMessage = data.message.trim();

      if (rawMessage && rawMessage !== defaultWish) {
        // Clear message area with subtle matching cream fill
        ctx.save();
        ctx.fillStyle = '#FAF4E8';
        ctx.fillRect(470, 560, 500, 150);
        ctx.restore();

        let msgFontSize = 28;
        if (rawMessage.length > 120) msgFontSize = 24;
        if (rawMessage.length > 180) msgFontSize = 21;
        if (rawMessage.length > 250) msgFontSize = 18;

        ctx.font = `italic 500 ${msgFontSize}px "Playfair Display", "Cormorant Garamond", Georgia, serif`;
        ctx.fillStyle = '#3A2A2E';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxLineWidth = 460;
        const paragraphs = rawMessage.split('\n');
        const lines: string[] = [];

        for (const p of paragraphs) {
          const words = p.split(/\s+/).filter(Boolean);
          if (words.length === 0) {
            lines.push('');
            continue;
          }
          let currentLine = words[0];
          for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            if (ctx.measureText(testLine).width <= maxLineWidth) {
              currentLine = testLine;
            } else {
              lines.push(currentLine);
              currentLine = words[i];
            }
          }
          lines.push(currentLine);
        }

        const lineHeight = msgFontSize * 1.5;
        const totalBlockHeight = (lines.length - 1) * lineHeight;
        const startY = 642 - totalBlockHeight / 2;

        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], 722, startY + i * lineHeight);
        }
      }

      // 4. Render 'From' Sender Name (only if user provided one)
      const fromText = data.from.trim();
      if (fromText) {
        const fromLen = fromText.length;
        const fromFontSize = fromLen <= 10 ? 46 : fromLen <= 16 ? 38 : 30;
        ctx.font = `italic 600 ${fromFontSize}px "Playfair Display", "Cormorant Garamond", Georgia, serif`;
        ctx.fillStyle = '#2A1618';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fromText, 752, 842);
      }

      // 5. Convert to Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load card base image'));
    };
  });
}

export async function downloadCardPNG(data: CardRenderData, filename?: string): Promise<void> {
  const blob = await renderCardToBlob(data);
  const url = URL.createObjectURL(blob);
  const safeFilename =
    filename ||
    `Jyoti-Diwali-Wish-${(data.to || 'Greeting').replace(/[^a-zA-Z0-9]/g, '-')}.png`;

  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

