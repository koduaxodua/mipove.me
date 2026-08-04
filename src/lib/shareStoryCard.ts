import type { Dog } from '@/data/dogs';
import { petShareUrl } from '@/lib/sharePet';

const WIDTH = 1080;
const HEIGHT = 1920;
const PHOTO_X = 56;
const PHOTO_Y = 148;
const PHOTO_WIDTH = WIDTH - PHOTO_X * 2;
const PHOTO_HEIGHT = 900;
const PHOTO_RADIUS = 52;

type ShareStoryResult = 'shared' | 'downloaded' | 'dismissed';

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (context.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:!?]?$/, '')}...`;
  }

  return lines;
}

async function loadPhoto(url: string): Promise<HTMLImageElement | null> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return null;

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    URL.revokeObjectURL(objectUrl);
    return image;
  } catch (error) {
    console.log('[story-card] photo unavailable', { message: error instanceof Error ? error.message : 'unknown' });
    return null;
  }
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const scale = Math.max(PHOTO_WIDTH / image.width, PHOTO_HEIGHT / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, PHOTO_X + (PHOTO_WIDTH - width) / 2, PHOTO_Y + (PHOTO_HEIGHT - height) / 2, width, height);
}

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('Could not create story card'))), 'image/png');
  });
}

export async function sharePetStoryCard(dog: Dog, locale: 'ka' | 'en'): Promise<ShareStoryResult> {
  console.log('[story-card] creating', { id: dog.id });

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');

  context.fillStyle = '#171717';
  context.fillRect(0, 0, WIDTH, HEIGHT);

  roundedRect(context, PHOTO_X - 18, PHOTO_Y - 18, PHOTO_WIDTH + 36, PHOTO_HEIGHT + 36, PHOTO_RADIUS + 12);
  context.fillStyle = '#000000';
  context.fill();

  const photo = await loadPhoto(dog.photo);
  if (photo) {
    context.save();
    roundedRect(context, PHOTO_X, PHOTO_Y, PHOTO_WIDTH, PHOTO_HEIGHT, PHOTO_RADIUS);
    context.clip();
    drawCover(context, photo);
    const overlay = context.createLinearGradient(0, PHOTO_Y, 0, PHOTO_Y + PHOTO_HEIGHT);
    overlay.addColorStop(0, 'rgba(0, 0, 0, 0.06)');
    overlay.addColorStop(1, 'rgba(0, 0, 0, 0.72)');
    context.fillStyle = overlay;
    context.fillRect(PHOTO_X, PHOTO_Y, PHOTO_WIDTH, PHOTO_HEIGHT);
    context.restore();
  } else {
    roundedRect(context, PHOTO_X, PHOTO_Y, PHOTO_WIDTH, PHOTO_HEIGHT, PHOTO_RADIUS);
    context.fillStyle = '#24201a';
    context.fill();
  }

  context.fillStyle = '#ffffff';
  context.font = '700 46px Arial, sans-serif';
  context.fillText('mipove.me', 72, 92);
  context.fillStyle = '#f5a524';
  context.fillRect(72, 116, 154, 8);

  const contentTop = PHOTO_Y + PHOTO_HEIGHT + 86;
  context.fillStyle = '#f5a524';
  context.font = '700 30px Arial, sans-serif';
  context.fillText(locale === 'en' ? 'HELP THIS PET' : 'დაეხმარე ამ ცხოველს', 72, contentTop);

  context.fillStyle = '#ffffff';
  context.font = '700 76px Arial, sans-serif';
  for (const [index, line] of wrapText(context, dog.name, WIDTH - 144, 2).entries()) {
    context.fillText(line, 72, contentTop + 100 + index * 88);
  }

  const detailsY = contentTop + 282;
  context.fillStyle = '#f3f4f6';
  context.font = '500 34px Arial, sans-serif';
  context.fillText([dog.age, dog.breed].filter(Boolean).join(' · '), 72, detailsY);

  context.fillStyle = '#f5a524';
  context.font = '600 32px Arial, sans-serif';
  for (const [index, line] of wrapText(context, dog.location || (locale === 'en' ? 'Approximate location' : 'დაახლოებითი მდებარეობა'), WIDTH - 144, 2).entries()) {
    context.fillText(line, 72, detailsY + 70 + index * 42);
  }

  context.fillStyle = '#ffffff';
  context.font = '500 34px Arial, sans-serif';
  for (const [index, line] of wrapText(context, dog.description, WIDTH - 144, 4).entries()) {
    context.fillText(line, 72, detailsY + 170 + index * 48);
  }

  context.fillStyle = '#2b2d30';
  context.fillRect(72, HEIGHT - 184, WIDTH - 144, 2);
  context.fillStyle = '#ffffff';
  context.font = '600 30px Arial, sans-serif';
  context.fillText(locale === 'en' ? 'See the profile:' : 'პროფილის ნახვა:', 72, HEIGHT - 108);
  context.fillStyle = '#f5a524';
  context.fillText(petShareUrl(dog.id).replace(/^https?:\/\//, ''), 72, HEIGHT - 58);

  const file = new File([await canvasBlob(canvas)], `mipove-${dog.id}-story.png`, { type: 'image/png' });
  const shareData = { files: [file], title: `${dog.name} - mipove.me` };

  if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
    try {
      await navigator.share(shareData);
      console.log('[story-card] shared', { id: dog.id });
      return 'shared';
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'dismissed';
    }
  }

  const downloadUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(downloadUrl);
  console.log('[story-card] downloaded', { id: dog.id });
  return 'downloaded';
}
