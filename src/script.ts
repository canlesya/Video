// Seslendirme metni ve zamanlamalar — videonun tek kaynağı burası.
// Seslendirmeyi kaydettikten sonra süreler tutmazsa sadece start/end
// değerlerini değiştirin; sahneler ve altyazılar otomatik uyum sağlar.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// public/ klasörüne koyduğunuz ses dosyalarının adı (yoksa null bırakın)
export const VOICEOVER_FILE: string | null = null; // örn. 'seslendirme.mp3'
export const MUSIC_FILE: string | null = null; // örn. 'muzik.mp3'
export const MUSIC_VOLUME = 0.12;

export type SceneId =
	| 'hook'
	| 'sabah'
	| 'ates'
	| 'toplama'
	| 'av'
	| 'bos'
	| 'alet'
	| 'gece'
	| 'kapanis';

export type Segment = {
	scene: SceneId;
	/** saniye */
	start: number;
	/** saniye */
	end: number;
	/** seslendirme cümlesi (altyazı da buradan üretilir) */
	text: string;
	/** ekranda / tabloda görünen kısa başlık */
	label: string;
};

export const SEGMENTS: Segment[] = [
	{
		scene: 'hook',
		start: 0,
		end: 5.5,
		label: 'Giriş',
		text: 'Alarm yok. İş yok. Fatura yok. Peki ilk insanlar bütün gün ne yapardı?',
	},
	{
		scene: 'sabah',
		start: 5.5,
		end: 11.5,
		label: 'Sabah',
		text: 'Gün, güneşle başlardı. Mağarada ya da deri çadırlarda, hayvan postlarının üstünde uyanırlardı.',
	},
	{
		scene: 'ates',
		start: 11.5,
		end: 19,
		label: 'Ateş',
		text: 'İlk iş, gece boyunca korunan ateşi canlandırmaktı. Çünkü ateş; sıcaklık, ışık ve vahşi hayvanlara karşı koruma demekti.',
	},
	{
		scene: 'toplama',
		start: 19,
		end: 27.5,
		label: 'Toplayıcılık',
		text: 'Sonra grup dağılırdı. Bir kısmı meyve, kök, fındık ve yabani bitki toplardı. Günlük besinin büyük kısmı buradan gelirdi.',
	},
	{
		scene: 'av',
		start: 27.5,
		end: 36,
		label: 'Av',
		text: 'Diğerleri ise ava çıkardı. Mızraklarla saatlerce iz sürer, geyikleri kovalarlardı. Ama çoğu zaman eli boş dönerlerdi.',
	},
	{
		scene: 'bos',
		start: 36,
		end: 46,
		label: 'Boş zaman',
		text: 'İşin ilginç yanı: Bazı antropologlara göre avcı toplayıcılar, yiyecek bulmak için günde sadece dört beş saat harcardı. Gerisi mi? Dinlenmek, sohbet ve uyku.',
	},
	{
		scene: 'alet',
		start: 46,
		end: 53,
		label: 'Alet ve sanat',
		text: 'Boş vakitlerde taşları yontup alet yapar, mağara duvarlarına resimler çizerlerdi. Bazıları bugün hâlâ duruyor!',
	},
	{
		scene: 'gece',
		start: 53,
		end: 60,
		label: 'Gece',
		text: 'Akşam olunca herkes ateşin başında toplanırdı. Et pişirilir, paylaşılır ve hikâyeler anlatılırdı.',
	},
	{
		scene: 'kapanis',
		start: 60,
		end: 65,
		label: 'Kapanış',
		text: 'Sence sen o çağda bir gün bile dayanabilir miydin? Yorumlara yaz!',
	},
];

export const TOTAL_SECONDS = SEGMENTS[SEGMENTS.length - 1].end;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);

export const sec = (s: number) => Math.round(s * FPS);
