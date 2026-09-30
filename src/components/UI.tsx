import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ALL_CHUNKS} from '../captions';
import {pop} from '../anim';
import {FPS} from '../script';
import {OUT} from './palette';

export const FONT = 'Luckiest, Impact, sans-serif';
export const up = (s: string) => s.toLocaleUpperCase('tr-TR');

/** Kelime kelime vurgulanan altyazı */
export const Captions: React.FC<{y?: number}> = ({y = 1480}) => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const idx = ALL_CHUNKS.findIndex((c, i) => t >= c.start && t < (ALL_CHUNKS[i + 1]?.start ?? c.end + 0.6));
	if (idx < 0) return null;
	const chunk = ALL_CHUNKS[idx];
	if (t > chunk.end + 0.6) return null;
	const inS = pop(f, chunk.start, 12);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: y,
					transform: `translateY(-50%) scale(${interpolate(inS, [0, 1], [0.7, 1])})`,
					textAlign: 'center',
					fontFamily: FONT,
					fontSize: 92,
					lineHeight: 1.1,
					letterSpacing: 1,
				}}
			>
				{chunk.words.map((w, i) => {
					const active = t >= w.start && t < (chunk.words[i + 1]?.start ?? chunk.end + 0.6);
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								margin: '0 12px',
								color: active ? '#ffd23f' : '#ffffff',
								WebkitTextStroke: `16px ${OUT}`,
								paintOrder: 'stroke fill',
								textShadow: '0 8px 0 rgba(0,0,0,0.45)',
								transform: active ? 'scale(1.08) rotate(-2deg)' : 'none',
							}}
						>
							{up(w.text)}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** SVG içinde konturlu, yaylı giriş yapan yazı */
export const Label: React.FC<{
	x: number;
	y: number;
	text: string;
	at: number;
	size?: number;
	color?: string;
	rotate?: number;
	until?: number;
	anchor?: 'middle' | 'start' | 'end';
}> = ({x, y, text, at, size = 90, color = '#ffffff', rotate = 0, until, anchor = 'middle'}) => {
	const f = useCurrentFrame();
	const s = pop(f, at);
	const out = until === undefined ? 1 : interpolate(f, [until * FPS, until * FPS + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (s <= 0.001 || out <= 0) return null;
	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s * out})`}>
			<text
				textAnchor={anchor}
				dominantBaseline="middle"
				fontFamily={FONT}
				fontSize={size}
				fill={color}
				stroke={OUT}
				strokeWidth={size * 0.2}
				strokeLinejoin="round"
				paintOrder="stroke fill"
				style={{letterSpacing: 2}}
			>
				{up(text)}
			</text>
		</g>
	);
};

/** Yuvarlak köşeli etiket balonu (ikonla birlikte) */
export const Badge: React.FC<{
	x: number;
	y: number;
	text: string;
	at: number;
	color?: string;
	icon?: React.ReactNode;
	size?: number;
	until?: number;
}> = ({x, y, text, at, color = '#ffd23f', icon, size = 58, until}) => {
	const f = useCurrentFrame();
	const s = pop(f, at, 9);
	const out = until === undefined ? 1 : interpolate(f, [until * FPS, until * FPS + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (s <= 0.001 || out <= 0) return null;
	const w = up(text).length * size * 0.62 + (icon ? size * 1.5 : 0) + 60;
	const h = size * 1.7;
	return (
		<g transform={`translate(${x} ${y}) scale(${s * out}) rotate(${(1 - s) * -12})`}>
			<rect x={-w / 2} y={-h / 2 + 8} width={w} height={h} rx={h / 2} fill="rgba(0,0,0,0.35)" />
			<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} stroke={OUT} strokeWidth={7} />
			{icon ? <g transform={`translate(${-w / 2 + 30 + size * 0.6} 0)`}>{icon}</g> : null}
			<text
				x={icon ? size * 0.75 : 0}
				y={4}
				textAnchor="middle"
				dominantBaseline="middle"
				fontFamily={FONT}
				fontSize={size}
				fill={OUT}
			>
				{up(text)}
			</text>
		</g>
	);
};

/** Günün saatini gösteren üst çip */
export const TimeChip: React.FC<{time: string; label: string; night?: boolean}> = ({time, label, night}) => {
	const f = useCurrentFrame();
	const s = pop(f, 0.15, 12);
	const tw = time.length * 33;
	const lw = up(label).length * 33;
	const w = 90 + tw + 24 + lw + 50;
	const x0 = -w / 2;
	return (
		<g transform={`translate(540 150) scale(${s})`}>
			<rect x={x0} y={-58} width={w} height={116} rx={58} fill="rgba(20,12,8,0.78)" stroke="#fff3" strokeWidth={4} />
			<g transform={`translate(${x0 + 62} 0)`}>
				{night ? (
					<path d="M 14 -30 A 32 32 0 1 0 22 26 A 26 26 0 1 1 14 -30 Z" fill="#f4f1e2" />
				) : (
					<g>
						{Array.from({length: 8}, (_, i) => (
							<path
								key={i}
								d="M 0 -40 L 0 -30"
								stroke="#ffd23f"
								strokeWidth={7}
								strokeLinecap="round"
								transform={`rotate(${i * 45 + f * 2})`}
							/>
						))}
						<circle r={20} fill="#ffd23f" />
					</g>
				)}
			</g>
			<text x={x0 + 110} y={6} dominantBaseline="middle" fontFamily={FONT} fontSize={56} fill="#ffd23f">
				{time}
			</text>
			<text x={x0 + 110 + tw + 24} y={6} dominantBaseline="middle" fontFamily={FONT} fontSize={52} fill="#ffffff">
				{up(label)}
			</text>
		</g>
	);
};

/** Yavaş yakınlaşma / kaydırma yapan kamera grubu */
export const Cam: React.FC<{
	dur: number;
	from?: number;
	to?: number;
	cx?: number;
	cy?: number;
	panX?: number;
	panY?: number;
	children: React.ReactNode;
}> = ({dur, from = 1, to = 1.08, cx = 540, cy = 960, panX = 0, panY = 0, children}) => {
	const f = useCurrentFrame();
	const k = interpolate(f, [0, dur], [0, 1], {extrapolateRight: 'clamp'});
	const sc = from + (to - from) * k;
	return (
		<g transform={`translate(${cx + panX * k} ${cy + panY * k}) scale(${sc}) translate(${-cx} ${-cy})`}>{children}</g>
	);
};

export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill>
		<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{display: 'block'}}>
			{children}
		</svg>
	</AbsoluteFill>
);

/** Yükselen "Z z z" */
export const Zzz: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
	<g>
		{[0, 1, 2].map((i) => {
			const life = ((t + i * 20) % 60) / 60;
			return (
				<text
					key={i}
					x={x + life * 80 + Math.sin(life * 6) * 10}
					y={y - life * 180}
					fontFamily={FONT}
					fontSize={50 + life * 40}
					fill="#ffffff"
					stroke={OUT}
					strokeWidth={10}
					paintOrder="stroke fill"
					opacity={Math.sin(life * Math.PI)}
				>
					Z
				</text>
			);
		})}
	</g>
);

/** Kırmızı çarpı işareti */
export const Cross: React.FC<{s: number}> = ({s}) => (
	<g transform={`scale(${s})`} opacity={Math.min(1, s)}>
		<path d="M -70 -70 L 70 70 M 70 -70 L -70 70" stroke={OUT} strokeWidth={36} strokeLinecap="round" />
		<path d="M -70 -70 L 70 70 M 70 -70 L -70 70" stroke="#e8322b" strokeWidth={22} strokeLinecap="round" />
	</g>
);
