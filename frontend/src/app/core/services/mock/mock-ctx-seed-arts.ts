import type { Artwork, MusicRecord, CalligraphySample } from '../../models/lesson-planner.models';

export interface ArtsSeedContext {
  artworks: Artwork[];
  musicRecords: MusicRecord[];
  calligraphySamples: CalligraphySample[];
  now: () => string;
}

export function seedArtsData(ctx: ArtsSeedContext): void {
  const now = ctx.now();
  const svg = (bg: string, fg: string, label: string): string => {
    const escaped = label.replace(/'/g, '').replace(/#/g, '%23');
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='${encodeURIComponent(bg)}'/%3E%3Ctext x='200' y='160' font-size='34' text-anchor='middle' fill='${encodeURIComponent(fg)}' font-family='Tahoma'%3E${encodeURIComponent(escaped)}%3C/text%3E%3C/svg%3E`;
  };
  ctx.artworks.push(
    {
      id: 1,
      userId: 42,
      title: 'نقاشی طبیعت',
      type: 'painting',
      fileUrl: svg('#7fb3d5', '#fff', 'طبیعت'),
      description: 'نقاشی منظره با آبرنگ',
      tags: 'طبیعت,آبرنگ',
      isPublic: true,
      likeCount: 12,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      userId: 42,
      title: 'صنایع دستی چوبی',
      type: 'craft',
      fileUrl: svg('#a9714b', '#fff', 'چوب'),
      description: 'ساخت جعبه چوبی',
      tags: 'چوب,صنایع دستی',
      isPublic: true,
      likeCount: 8,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 3,
      userId: 43,
      title: 'نقاشی خیال‌انگیز',
      type: 'painting',
      fileUrl: svg('#c0392b', '#fff', 'خیال'),
      description: 'اثر رنگ روغن',
      tags: 'رنگ روغن',
      isPublic: true,
      likeCount: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 4,
      userId: 43,
      title: 'سفالگری',
      type: 'craft',
      fileUrl: svg('#8d6e63', '#fff', 'سفال'),
      description: 'ظرف سفالی',
      tags: 'سفال',
      isPublic: true,
      likeCount: 3,
      createdAt: now,
      updatedAt: now,
    },
  );
  ctx.musicRecords.push(
    {
      id: 1,
      userId: 42,
      title: 'سرود گروهی',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artistName: 'علی احمدی',
      durationSeconds: 90,
      genre: 'سرود',
      description: 'سرود گروهی تربیتی',
      tags: 'سرود',
      isPublic: true,
      likeCount: 15,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      userId: 43,
      title: 'تلاوت قرآن',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      artistName: 'فاطمه محمدی',
      durationSeconds: 120,
      genre: 'تلاوت',
      description: 'تلاوت سوره مبارکه',
      tags: 'تلاوت,قرآن',
      isPublic: true,
      likeCount: 20,
      createdAt: now,
      updatedAt: now,
    },
  );
  ctx.calligraphySamples.push(
    {
      id: 1,
      userId: 42,
      title: 'خط نستعلیق بسم الله',
      imageUrl: svg('#faf3e0', '#8a6d1a', 'بسم الله'),
      style: 'نستعلیق',
      description: 'مشق نستعلیق',
      tags: 'نستعلیق,مشق',
      isPublic: true,
      likeCount: 18,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 2,
      userId: 43,
      title: 'خط ثلث',
      imageUrl: svg('#e8f5ee', '#14522d', 'لا اله الا الله'),
      style: 'ثلث',
      description: 'مشق خط ثلث',
      tags: 'ثلث',
      isPublic: true,
      likeCount: 9,
      createdAt: now,
      updatedAt: now,
    },
  );
}
