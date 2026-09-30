// Seslendirme metni ve zamanlamalar — videonun tek kaynağı burası.
// Seslendirme public/seslendirme.mp3 dosyasında. Kayıt değişirse start/end
// ve cümle aralıklarını (spans) güncelleyin;
// sahneler, altyazılar ve etiketler otomatik uyum sağlar.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// public/ klasörüne koyduğunuz ses dosyalarının adı (yoksa null bırakın)
export const VOICEOVER_FILE: string | null = 'seslendirme.mp3';
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
	/**
	 * Kayıttaki her cümlenin gerçek başlangıç/bitiş saniyesi (isteğe bağlı).
	 * Verilirse altyazı ve etiketler sese birebir oturur; verilmezse
	 * zamanlar kelime uzunluğundan tahmin edilir.
	 */
	spans?: [number, number][];
};

export const SEGMENTS: Segment[] = [
	{
		scene: 'hook',
		start: 0,
		end: 5.5,
		label: 'Giriş',
		spans: [[0.3, 0.87], [1.06, 1.51], [1.68, 2.17], [2.77, 4.83]],
		text: 'Alarm yok. İş yok. Fatura yok. Peki ilk insanlar bütün gün ne yapardı?',
	},
	{
		scene: 'sabah',
		start: 5.5,
		end: 11.5,
		label: 'Sabah',
		spans: [[5.76, 6.81], [7.3, 10.87]],
		text: 'Gün, güneşle başlardı. Mağarada ya da deri çadırlarda, hayvan postlarının üstünde uyanırlardı.',
	},
	{
		scene: 'ates',
		start: 11.5,
		end: 19,
		label: 'Ateş',
		spans: [[11.81, 14.21], [14.78, 18.33]],
		text: 'İlk iş, gece boyunca korunan ateşi canlandırmaktı. Çünkü ateş; sıcaklık, ışık ve vahşi hayvanlara karşı koruma demekti.',
	},
	{
		scene: 'toplama',
		start: 19,
		end: 27.5,
		label: 'Toplayıcılık',
		spans: [[19.17, 20.2], [20.77, 24.06], [24.66, 26.78]],
		text: 'Sonra grup dağılırdı. Bir kısmı meyve, kök, fındık ve yabani bitki toplardı. Günlük besinin büyük kısmı buradan gelirdi.',
	},
	{
		scene: 'av',
		start: 27.5,
		end: 36,
		label: 'Av',
		spans: [[27.8, 29.09], [29.69, 32.87], [33.48, 35.29]],
		text: 'Diğerleri ise ava çıkardı. Mızraklarla saatlerce iz sürer, geyikleri kovalarlardı. Ama çoğu zaman eli boş dönerlerdi.',
	},
	{
		scene: 'bos',
		start: 36,
		end: 46,
		label: 'Boş zaman',
		spans: [[36.27, 36.97], [37.46, 42.81], [43.27, 43.61], [44.09, 45.4]],
		text: 'İşin ilginç yanı: Bazı antropologlara göre avcı toplayıcılar, yiyecek bulmak için günde sadece dört beş saat harcardı. Gerisi mi? Dinlenmek, sohbet ve uyku.',
	},
	{
		scene: 'alet',
		start: 46,
		end: 53,
		label: 'Alet ve sanat',
		spans: [[46.32, 50.52], [51.1, 52.39]],
		text: 'Boş vakitlerde taşları yontup alet yapar, mağara duvarlarına resimler çizerlerdi. Bazıları bugün hâlâ duruyor!',
	},
	{
		scene: 'gece',
		start: 53,
		end: 60,
		label: 'Gece',
		spans: [[53.32, 55.81], [56.43, 59.34]],
		text: 'Akşam olunca herkes ateşin başında toplanırdı. Et pişirilir, paylaşılır ve hikâyeler anlatılırdı.',
	},
	{
		scene: 'kapanis',
		start: 60,
		end: 65,
		label: 'Kapanış',
		spans: [[60.33, 63.16], [63.77, 64.35]],
		text: 'Sence sen o çağda bir gün bile dayanabilir miydin? Yorumlara yaz!',
	},
];

export const TOTAL_SECONDS = SEGMENTS[SEGMENTS.length - 1].end;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);

export const sec = (s: number) => Math.round(s * FPS);
