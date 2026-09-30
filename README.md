# İlk İnsanlar Günü Nasıl Geçirirdi? — Kodla Yapılmış Dikey Video

[Remotion](https://www.remotion.dev) (React) ile tamamen kodla çizilip canlandırılmış, 65 saniyelik
dikey kısa video (YouTube Shorts / Reels / TikTok, 1080×1920).

- Seslendirme metni ve saniyeler: **[SESLENDIRME_METNI.md](SESLENDIRME_METNI.md)**
- Hazır video: `npm run render` komutu `out/ilk-insanlar.mp4` dosyasını üretir

## Kurulum

```bash
npm install
npm start          # Remotion Studio: tarayıcıda canlı önizleme
npm run render     # out/ilk-insanlar.mp4 dosyasını üretir
```

## Seslendirme ve müzik ekleme

1. Ses kaydınızı `public/seslendirme.mp3` olarak kaydedin (isteğe bağlı müzik: `public/muzik.mp3`).
2. `src/script.ts` dosyasında:
   ```ts
   export const VOICEOVER_FILE: string | null = 'seslendirme.mp3';
   export const MUSIC_FILE: string | null = 'muzik.mp3';
   ```
3. Kaydın süreleri farklıysa aynı dosyadaki `SEGMENTS` içindeki `start` / `end` saniyelerini düzeltin.
   Altyazılar, sahne süreleri ve ekranda açılan etiketler bu zamanlardan otomatik hesaplanır.
4. `npm run render`

## Proje yapısı

```
src/
  script.ts            # metin + zamanlamalar (tek kaynak)
  captions.ts          # kelime kelime altyazı zamanlaması
  Video.tsx            # sahneleri sıralar, geçişler, altyazı, ses
  components/
    Character.tsx      # çizgi film mağara insanı (poz, göz, ağız, kıyafet)
    Scenery.tsx        # gökyüzü, dağ, ağaç, çadır, ateş, geyik, mızrak...
    UI.tsx             # altyazı, etiket, saat çipi, kamera hareketi
  scenes/              # 9 sahne: Hook, Sabah, Ates, Toplama, Av, Bos, Alet, Gece, Kapanis
public/
  LuckiestGuy-Regular.ttf   # Türkçe karakter destekli yazı tipi (Apache 2.0)
```

> Not: Remotion bireyler ve 3 kişiye kadar şirketler için ücretsizdir; daha büyük şirketler için
> şirket lisansı gerekir (remotion.dev/license).
