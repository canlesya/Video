import {SEGMENTS, SceneId, Segment} from './script';

export type Word = {text: string; start: number; end: number};
export type Chunk = {words: Word[]; start: number; end: number};

const PUNCT = /[.,!?;:]$/;

/**
 * Kelime zamanlarını tahmin eder: her kelimeye uzunluğu kadar,
 * noktalama işaretlerinden sonra da kısa bir duraklama payı verilir.
 */
const SENTENCE_END = /[.!?:]$/;
const letters = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2;

/** Kelimeleri verilen zaman aralığına uzunluklarına göre yayar */
const spread = (raw: string[], from: number, to: number, pauses: boolean): Word[] => {
	const weights = raw.map((w) => letters(w) + (pauses && PUNCT.test(w) ? 4 : 0));
	const total = weights.reduce((a, b) => a + b, 0);
	let acc = 0;
	return raw.map((text, i) => {
		const start = from + (acc / total) * (to - from);
		acc += weights[i];
		const end = from + ((acc - (pauses && PUNCT.test(text) ? 4 : 0)) / total) * (to - from);
		return {text, start, end};
	});
};

/**
 * Kelime zamanları: segmentte kayıttan ölçülmüş cümle aralıkları (spans)
 * varsa her cümlenin kelimeleri kendi aralığına yayılır; yoksa tüm segment
 * boyunca uzunluğa göre tahmin edilir.
 */
export const segmentWords = (seg: Segment): Word[] => {
	const raw = seg.text.split(/\s+/).filter(Boolean);
	if (!seg.spans) return spread(raw, seg.start + 0.15, seg.end - 0.25, true);
	const sentences: string[][] = [[]];
	raw.forEach((w) => {
		sentences[sentences.length - 1].push(w);
		if (SENTENCE_END.test(w)) sentences.push([]);
	});
	const list = sentences.filter((x) => x.length);
	if (list.length !== seg.spans.length) {
		throw new Error(`"${seg.scene}" sahnesinde ${list.length} cümle var ama ${seg.spans.length} zaman aralığı verilmiş`);
	}
	return list.flatMap((words, i) => spread(words, seg.spans![i][0], seg.spans![i][1], false));
};

export const segmentChunks = (seg: Segment): Chunk[] => {
	const words = segmentWords(seg);
	const chunks: Chunk[] = [];
	let cur: Word[] = [];
	words.forEach((w, i) => {
		cur.push(w);
		const letters = cur.reduce((a, b) => a + b.text.length, 0);
		if (PUNCT.test(w.text) || cur.length >= 3 || letters > 16 || i === words.length - 1) {
			chunks.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
			cur = [];
		}
	});
	return chunks;
};

export const ALL_CHUNKS: Chunk[] = SEGMENTS.flatMap(segmentChunks);

/** Bir sahnede belirli bir kelimenin söylendiği an (sahne başına göre saniye) */
export const wordAt = (scene: SceneId, needle: string, nth = 0): number => {
	const seg = SEGMENTS.find((s) => s.scene === scene)!;
	const words = segmentWords(seg);
	const n = needle.toLocaleLowerCase('tr-TR');
	const hits = words.filter((w) => w.text.toLocaleLowerCase('tr-TR').includes(n));
	const w = hits[Math.min(nth, hits.length - 1)];
	return w ? w.start - seg.start : 0;
};
