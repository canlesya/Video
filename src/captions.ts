import {SEGMENTS, SceneId, Segment} from './script';

export type Word = {text: string; start: number; end: number};
export type Chunk = {words: Word[]; start: number; end: number};

const PUNCT = /[.,!?;:]$/;

/**
 * Kelime zamanlarını tahmin eder: her kelimeye uzunluğu kadar,
 * noktalama işaretlerinden sonra da kısa bir duraklama payı verilir.
 */
export const segmentWords = (seg: Segment): Word[] => {
	const raw = seg.text.split(/\s+/).filter(Boolean);
	const weights = raw.map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2 + (PUNCT.test(w) ? 4 : 0));
	const total = weights.reduce((a, b) => a + b, 0);
	const t0 = seg.start + 0.15;
	const span = seg.end - 0.25 - t0;
	let acc = 0;
	return raw.map((text, i) => {
		const start = t0 + (acc / total) * span;
		acc += weights[i];
		const end = t0 + ((acc - (PUNCT.test(text) ? 4 : 0)) / total) * span;
		return {text, start, end};
	});
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
