import React, {useId} from 'react';
import {OUT, rand} from './palette';

const gid = () => useId().replace(/[^a-zA-Z0-9]/g, '');

export const Sky: React.FC<{stops: string[]; h?: number}> = ({stops, h = 1920}) => {
	const id = gid();
	return (
		<>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					{stops.map((c, i) => (
						<stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
					))}
				</linearGradient>
			</defs>
			<rect x={-200} y={-200} width={1480} height={h + 200} fill={`url(#${id})`} />
		</>
	);
};

/** Kapalı hava bulutları (referans görsellerdeki gibi katmanlı gri bulutlar) */
export const Clouds: React.FC<{t: number; y: number; color: string; line: string; rows?: number; speed?: number}> = ({
	t,
	y,
	color,
	line,
	rows = 3,
	speed = 0.3,
}) => (
	<g>
		{Array.from({length: rows}, (_, r) => {
			const yy = y + r * 120;
			const off = ((t * speed * (1 + r * 0.3)) % 360) - 180;
			const bumps: string[] = [];
			let x = -400 + off + r * 60;
			bumps.push(`M ${x} ${yy + 60}`);
			let k = 0;
			while (x < 1500) {
				const w = 110 + rand(r * 20 + k) * 90;
				const hgt = 45 + rand(r * 30 + k) * 35;
				bumps.push(`q ${w / 2} ${-hgt * 2} ${w} 0`);
				x += w;
				k++;
			}
			bumps.push(`L ${x} ${yy + 200} L -500 ${yy + 200} Z`);
			return (
				<path
					key={r}
					d={bumps.join(' ')}
					fill={color}
					stroke={line}
					strokeWidth={4}
					opacity={0.55 + r * 0.15}
				/>
			);
		})}
	</g>
);

export const Stars: React.FC<{t: number; n?: number; maxY?: number}> = ({t, n = 70, maxY = 900}) => (
	<g>
		{Array.from({length: n}, (_, i) => {
			const x = rand(i * 1.3) * 1080;
			const y = rand(i * 2.7 + 5) * maxY;
			const tw = 0.5 + 0.5 * Math.sin(t * 0.15 + i);
			return <circle key={i} cx={x} cy={y} r={1.5 + rand(i) * 2.5} fill="#fdf6d8" opacity={0.35 + tw * 0.6} />;
		})}
	</g>
);

export const Moon: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => {
	const id = gid();
	return (
		<g>
			<defs>
				<radialGradient id={id}>
					<stop offset="0" stopColor="#fdf7dc" stopOpacity={0.55} />
					<stop offset="1" stopColor="#fdf7dc" stopOpacity={0} />
				</radialGradient>
			</defs>
			<circle cx={x} cy={y} r={r * 2.6} fill={`url(#${id})`} />
			<circle cx={x} cy={y} r={r} fill="#f4f1e2" stroke="#cfcab3" strokeWidth={4} />
			<circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill="#dcd8c3" />
			<circle cx={x + r * 0.35} cy={y + r * 0.25} r={r * 0.24} fill="#dcd8c3" />
			<circle cx={x + r * 0.1} cy={y - r * 0.5} r={r * 0.1} fill="#dcd8c3" />
		</g>
	);
};

export const Sun: React.FC<{x: number; y: number; r: number; t: number; color?: string}> = ({x, y, r, t, color = '#ffd35a'}) => {
	const id = gid();
	return (
		<g>
			<defs>
				<radialGradient id={id}>
					<stop offset="0" stopColor="#fff2b0" stopOpacity={0.9} />
					<stop offset="0.4" stopColor="#ffc86a" stopOpacity={0.35} />
					<stop offset="1" stopColor="#ffb060" stopOpacity={0} />
				</radialGradient>
			</defs>
			<circle cx={x} cy={y} r={r * 5} fill={`url(#${id})`} />
			<g transform={`rotate(${t * 0.3} ${x} ${y})`} opacity={0.35}>
				{Array.from({length: 14}, (_, i) => {
					const a = (i / 14) * Math.PI * 2;
					const a2 = a + 0.1;
					return (
						<path
							key={i}
							d={`M ${x} ${y} L ${x + Math.cos(a) * r * 6} ${y + Math.sin(a) * r * 6} L ${x + Math.cos(a2) * r * 6} ${y + Math.sin(a2) * r * 6} Z`}
							fill="#fff3c4"
						/>
					);
				})}
			</g>
			<circle cx={x} cy={y} r={r} fill={color} stroke="#e8a23c" strokeWidth={5} />
		</g>
	);
};

export const Ridge: React.FC<{y: number; amp: number; color: string; seed: number; line?: string; peaks?: number}> = ({
	y,
	amp,
	color,
	seed,
	line = OUT,
	peaks = 6,
}) => {
	const pts: string[] = [`M -100 ${y + amp}`];
	for (let i = 0; i <= peaks; i++) {
		const x = -100 + (1280 / peaks) * i;
		const py = y - amp * (0.4 + 0.6 * rand(seed + i));
		const mx = x - 1280 / peaks / 2;
		const my = y + amp * 0.1 * rand(seed + i * 3);
		pts.push(`Q ${mx} ${my} ${x} ${py}`);
	}
	pts.push(`L 1180 2100 L -100 2100 Z`);
	return <path d={pts.join(' ')} fill={color} stroke={line} strokeWidth={5} strokeLinejoin="round" />;
};

export const Ground: React.FC<{y: number; top: string; bottom: string; line?: boolean}> = ({y, top, bottom, line = true}) => {
	const id = gid();
	return (
		<g>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={top} />
					<stop offset="1" stopColor={bottom} />
				</linearGradient>
			</defs>
			<rect x={-200} y={y} width={1480} height={2400 - y} fill={`url(#${id})`} />
			{line ? <path d={`M -200 ${y} L 1280 ${y}`} stroke={OUT} strokeWidth={4} opacity={0.5} /> : null}
		</g>
	);
};

export const Tree: React.FC<{x: number; y: number; s?: number; color?: string; dark?: string; seed?: number}> = ({
	x,
	y,
	s = 1,
	color = '#4c6b45',
	dark = '#3b5638',
	seed = 1,
}) => {
	const blobs = Array.from({length: 7}, (_, i) => ({
		cx: (rand(seed + i) - 0.5) * 170,
		cy: -330 - rand(seed + i * 2) * 170,
		r: 70 + rand(seed + i * 3) * 40,
	}));
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<path d="M -22 0 Q -14 -150 -18 -300 L 18 -300 Q 14 -150 26 0 Z" fill="#6a4a30" stroke={OUT} strokeWidth={5} />
			<path d="M -6 -200 L -60 -270 M 8 -230 L 60 -300" stroke="#6a4a30" strokeWidth={14} strokeLinecap="round" />
			{blobs.map((b, i) => (
				<circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={i % 2 ? color : dark} stroke={OUT} strokeWidth={5} />
			))}
			{blobs.map((b, i) => (
				<circle key={`h${i}`} cx={b.cx - b.r * 0.2} cy={b.cy - b.r * 0.25} r={b.r * 0.55} fill={color} opacity={0.6} />
			))}
		</g>
	);
};

export const Acacia: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = '#6f8a4a'}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path
			d="M -14 0 Q -6 -120 -40 -230 M -4 -120 Q 30 -180 70 -250 M -30 -190 Q -80 -220 -110 -250"
			stroke={OUT}
			strokeWidth={24}
			fill="none"
			strokeLinecap="round"
		/>
		<path
			d="M -14 0 Q -6 -120 -40 -230 M -4 -120 Q 30 -180 70 -250 M -30 -190 Q -80 -220 -110 -250"
			stroke="#6b4e34"
			strokeWidth={14}
			fill="none"
			strokeLinecap="round"
		/>
		<path
			d="M -200 -250 Q -190 -300 -120 -300 Q -60 -330 0 -310 Q 60 -340 130 -300 Q 190 -300 200 -255 Q 100 -235 0 -245 Q -100 -232 -200 -250 Z"
			fill={color}
			stroke={OUT}
			strokeWidth={5}
		/>
		<path d="M -150 -262 Q -60 -285 40 -270 Q 110 -290 170 -268" stroke="#57703a" strokeWidth={6} fill="none" opacity={0.7} />
	</g>
);

/** Deri çadır (tipi) */
export const Tent: React.FC<{x: number; y: number; s?: number; color?: string; flip?: boolean}> = ({
	x,
	y,
	s = 1,
	color = '#8a6a48',
	flip = false,
}) => (
	<g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
		<path d="M -40 -330 L 30 -400 M 40 -330 L -30 -400 M 0 -335 L 5 -410" stroke={OUT} strokeWidth={16} strokeLinecap="round" />
		<path d="M -40 -330 L 30 -400 M 40 -330 L -30 -400 M 0 -335 L 5 -410" stroke="#7a5a3a" strokeWidth={8} strokeLinecap="round" />
		<path d="M -190 0 L -30 -330 L 30 -330 L 190 0 Z" fill={color} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
		<path d="M -110 -160 L 110 -160 M -150 -80 L 150 -80" stroke={OUT} strokeWidth={3} opacity={0.35} />
		<path d="M -60 -200 L -80 -40 M 70 -230 L 95 -60" stroke={OUT} strokeWidth={3} opacity={0.35} strokeDasharray="10 8" />
		<path d="M -55 0 Q 0 -190 55 0 Z" fill="#3a2a1c" stroke={OUT} strokeWidth={5} />
		<path d="M 20 -120 Q 70 -40 60 0" stroke={OUT} strokeWidth={5} fill={color} />
	</g>
);

/** Saman kulübe (2. referans görseldeki gibi) */
export const Hut: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M -150 0 L -150 -120 L 150 -120 L 150 0 Z" fill="#a08660" stroke={OUT} strokeWidth={5} />
		<path d="M -45 0 Q -45 -100 0 -100 Q 45 -100 45 0 Z" fill="#3a2c1e" stroke={OUT} strokeWidth={5} />
		<path d="M -190 -110 Q -100 -210 0 -300 Q 100 -210 190 -110 Q 0 -90 -190 -110 Z" fill="#b39868" stroke={OUT} strokeWidth={5} />
		{Array.from({length: 12}, (_, i) => (
			<path key={i} d={`M ${-160 + i * 28} -112 L ${-30 + i * 6} -250`} stroke="#8a7048" strokeWidth={3} />
		))}
	</g>
);

export const Rock: React.FC<{x: number; y: number; w: number; h: number; seed?: number; color?: string}> = ({
	x,
	y,
	w,
	h,
	seed = 1,
	color = '#8b8f95',
}) => {
	const n = 9;
	const pts = Array.from({length: n}, (_, i) => {
		const a = Math.PI + (i / (n - 1)) * Math.PI;
		const r = 0.85 + rand(seed + i) * 0.2;
		return [x + Math.cos(a) * w * r, y + Math.sin(a) * h * r];
	});
	const d = `M ${x - w} ${y} ` + pts.map((p) => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + ` L ${x + w} ${y} Z`;
	return (
		<g>
			<path d={d} fill={color} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
			<path
				d={`M ${x - w * 0.5} ${y - h * 0.55} Q ${x - w * 0.2} ${y - h * 0.8} ${x + w * 0.25} ${y - h * 0.7}`}
				stroke="#ffffff"
				strokeWidth={5}
				opacity={0.25}
				fill="none"
				strokeLinecap="round"
			/>
		</g>
	);
};

export const Grass: React.FC<{x: number; y: number; s?: number; color?: string}> = ({x, y, s = 1, color = '#5f7a3c'}) => (
	<path
		transform={`translate(${x} ${y}) scale(${s})`}
		d="M -30 0 Q -34 -40 -44 -60 Q -20 -40 -14 -10 Q -12 -60 -2 -80 Q 4 -40 6 -8 Q 16 -50 36 -66 Q 22 -30 24 0 Z"
		fill={color}
		stroke={OUT}
		strokeWidth={4}
		strokeLinejoin="round"
	/>
);

export const Bone: React.FC<{x: number; y: number; s?: number; r?: number}> = ({x, y, s = 1, r = 0}) => (
	<g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
		<path
			d="M -40 -6 L 40 -6 A 10 10 0 1 1 46 8 A 10 10 0 1 1 40 6 L -40 6 A 10 10 0 1 1 -46 -8 A 10 10 0 1 1 -40 -6 Z"
			fill="#efe6d2"
			stroke={OUT}
			strokeWidth={4}
		/>
	</g>
);

export const Log: React.FC<{x: number; y: number; w: number; s?: number}> = ({x, y, w, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d={`M ${-w / 2} -40 L ${w / 2} -40 L ${w / 2} 40 L ${-w / 2} 40 Z`} fill="#8a5d38" stroke={OUT} strokeWidth={6} />
		<path d={`M ${-w / 2 + 20} -15 L ${w / 2 - 40} -15 M ${-w / 2 + 60} 12 L ${w / 2 - 10} 12`} stroke="#6b4527" strokeWidth={5} />
		<ellipse cx={w / 2} cy={0} rx={22} ry={40} fill="#c79a66" stroke={OUT} strokeWidth={6} />
		<ellipse cx={w / 2} cy={0} rx={10} ry={20} fill="none" stroke="#8a5d38" strokeWidth={3} />
	</g>
);

export const FurRug: React.FC<{x: number; y: number; w: number; h: number; color?: string}> = ({x, y, w, h, color = '#9a7a55'}) => {
	const pts: string[] = [];
	const n = 26;
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2;
		const r = i % 2 ? 1 : 1.12;
		pts.push(`${(x + Math.cos(a) * w * r).toFixed(1)} ${(y + Math.sin(a) * h * r).toFixed(1)}`);
	}
	return (
		<g>
			<path d={`M ${pts.join(' L ')} Z`} fill={color} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
			<ellipse cx={x} cy={y} rx={w * 0.7} ry={h * 0.6} fill="#ffffff" opacity={0.12} />
		</g>
	);
};

/** Ateş + taş halka. intensity: 0 (kor) .. 1 (harlı) */
export const Fire: React.FC<{x: number; y: number; s?: number; t: number; intensity?: number; ring?: boolean}> = ({
	x,
	y,
	s = 1,
	t,
	intensity = 1,
	ring = true,
}) => {
	const id = gid();
	const k = Math.max(0, Math.min(1, intensity));
	const flame = (h: number, w: number, ph: number, dx = 0) => {
		const sway = Math.sin(t * 0.35 + ph) * w * 0.4 + Math.sin(t * 0.9 + ph * 2) * w * 0.12;
		const hh = h * (0.9 + 0.12 * Math.sin(t * 0.7 + ph * 3));
		return `M ${dx - w} 0 C ${dx - w * 1.1} ${-hh * 0.45} ${dx - w * 0.2 + sway * 0.3} ${-hh * 0.6} ${dx + sway} ${-hh} C ${dx + w * 0.3 + sway * 0.3} ${-hh * 0.6} ${dx + w * 1.1} ${-hh * 0.45} ${dx + w} 0 Z`;
	};
	const rocks = Array.from({length: 12}, (_, i) => {
		const a = (i / 12) * Math.PI * 2;
		return {x: Math.cos(a) * 165, y: Math.sin(a) * 50 + 10, back: Math.sin(a) < 0, i};
	});
	const rockEl = (r: (typeof rocks)[number]) => (
		<ellipse key={r.i} cx={r.x} cy={r.y} rx={38 + rand(r.i) * 10} ry={26 + rand(r.i + 4) * 6} fill={r.back ? '#7d7f84' : '#9a9ca1'} stroke={OUT} strokeWidth={5} />
	);
	const H = 60 + 220 * k;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<defs>
				<radialGradient id={id}>
					<stop offset="0" stopColor="#ffb347" stopOpacity={0.75} />
					<stop offset="0.45" stopColor="#ff8a2a" stopOpacity={0.25} />
					<stop offset="1" stopColor="#ff7a1a" stopOpacity={0} />
				</radialGradient>
			</defs>
			<ellipse cx={0} cy={-80} rx={380 + 260 * k} ry={300 + 220 * k} fill={`url(#${id})`} opacity={(0.4 + 0.6 * k) * (0.9 + 0.1 * Math.sin(t * 0.8))} />
			{ring ? rocks.filter((r) => r.back).map(rockEl) : null}
			<ellipse cx={0} cy={10} rx={140} ry={38} fill="#3a2418" />
			<g>
				<path d="M -110 25 L 90 -25" stroke={OUT} strokeWidth={36} strokeLinecap="round" />
				<path d="M -110 25 L 90 -25" stroke="#6b4527" strokeWidth={26} strokeLinecap="round" />
				<path d="M 110 25 L -90 -25" stroke={OUT} strokeWidth={36} strokeLinecap="round" />
				<path d="M 110 25 L -90 -25" stroke="#7a5030" strokeWidth={26} strokeLinecap="round" />
				<path d="M -30 30 L 20 -70" stroke={OUT} strokeWidth={32} strokeLinecap="round" />
				<path d="M -30 30 L 20 -70" stroke="#6b4527" strokeWidth={22} strokeLinecap="round" />
			</g>
			<ellipse cx={0} cy={0} rx={70 + 40 * k} ry={22} fill="#ff6a1a" opacity={0.5 + 0.3 * Math.sin(t * 0.5)} />
			<g opacity={0.25 + 0.75 * Math.min(1, k * 3)}>
				<path d={flame(H, 80 * (0.6 + 0.4 * k), 0)} fill="#f0582a" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
				<path d={flame(H * 0.72, 44 * (0.6 + 0.4 * k), 1.7, -52)} fill="#f0582a" stroke={OUT} strokeWidth={5} />
				<path d={flame(H * 0.66, 42 * (0.6 + 0.4 * k), 3.1, 55)} fill="#f0582a" stroke={OUT} strokeWidth={5} />
				<path d={flame(H * 0.78, 58 * (0.6 + 0.4 * k), 0.8)} fill="#ff9a2e" />
				<path d={flame(H * 0.5, 36 * (0.6 + 0.4 * k), 2.4, -40)} fill="#ff9a2e" />
				<path d={flame(H * 0.5, 34 * (0.6 + 0.4 * k), 4.1, 42)} fill="#ff9a2e" />
				<path d={flame(H * 0.48, 34 * (0.6 + 0.4 * k), 1.3)} fill="#ffe27a" />
			</g>
			{Array.from({length: 6}, (_, i) => {
				const life = ((t * 1.2 + i * 17) % 60) / 60;
				return (
					<circle
						key={i}
						cx={Math.sin(i * 2 + t * 0.1) * 60 + (rand(i) - 0.5) * 80}
						cy={-40 - life * (H + 120)}
						r={4}
						fill="#ffd06a"
						opacity={(1 - life) * k}
					/>
				);
			})}
			{ring ? rocks.filter((r) => !r.back).map(rockEl) : null}
		</g>
	);
};

export const Deer: React.FC<{x: number; y: number; s?: number; t: number; run?: boolean; flip?: boolean}> = ({
	x,
	y,
	s = 1,
	t,
	run = true,
	flip = false,
}) => {
	const c = '#a8703f';
	const ph = run ? t * 0.55 : 0;
	const leg = (lx: number, off: number) => {
		const a = run ? Math.sin(ph + off) * 38 : 0;
		const r = (a * Math.PI) / 180;
		const kx = lx + Math.sin(r) * 70;
		const ky = 40 + Math.cos(r) * 70;
		const r2 = r + (run ? (Math.sin(ph + off + 1.2) * 30 * Math.PI) / 180 : 0);
		const ex = kx + Math.sin(r2) * 70;
		const ey = ky + Math.cos(r2) * 70;
		const d = `M ${lx} 30 L ${kx} ${ky} L ${ex} ${ey}`;
		return (
			<g key={`${lx}${off}`}>
				<path d={d} stroke={OUT} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<path d={d} stroke={c} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
				<path d={`M ${ex - 8} ${ey} l 16 0 l -4 12 l -10 0 z`} fill="#3a2418" stroke={OUT} strokeWidth={3} />
			</g>
		);
	};
	const bob = run ? Math.abs(Math.sin(ph)) * -14 : 0;
	return (
		<g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`}>
			{leg(-70, Math.PI)}
			{leg(75, 0)}
			<path d="M -120 -10 Q -150 -40 -140 -60 Q -120 -40 -105 -25 Z" fill="#f4ecdc" stroke={OUT} strokeWidth={5} />
			<ellipse cx={0} cy={0} rx={125} ry={58} fill={c} stroke={OUT} strokeWidth={6} />
			<path d="M -80 30 Q 0 55 80 30" stroke="#e8d3b3" strokeWidth={14} fill="none" strokeLinecap="round" />
			{leg(-95, 0.3)}
			{leg(95, Math.PI + 0.3)}
			<path d="M 80 -30 Q 110 -100 140 -140 L 175 -115 Q 150 -70 120 10 Z" fill={c} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
			<path d="M 150 -150 L 150 -230 M 150 -195 L 120 -225 M 150 -210 L 175 -245 M 170 -148 L 195 -215 M 190 -190 L 225 -205" stroke="#5a3a1e" strokeWidth={9} strokeLinecap="round" />
			<path d="M 132 -140 Q 150 -175 185 -160 Q 230 -145 238 -120 Q 236 -105 215 -108 Q 180 -110 150 -110 Z" fill={c} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
			<path d="M 140 -150 Q 118 -180 128 -190 Q 146 -175 152 -156 Z" fill={c} stroke={OUT} strokeWidth={5} />
			<circle cx={190} cy={-140} r={11} fill="#fff" stroke={OUT} strokeWidth={4} />
			<circle cx={194} cy={-139} r={5} fill="#111" />
			<circle cx={236} cy={-120} r={6} fill="#241510" />
		</g>
	);
};

export const Spear: React.FC<{angle: number; len?: number; grip?: number}> = ({angle, len = 460, grip = 0.45}) => {
	const a = len * grip;
	const b = len * (1 - grip);
	return (
		<g transform={`rotate(${angle})`}>
			<path d={`M ${-a} 0 L ${b} 0`} stroke={OUT} strokeWidth={16} strokeLinecap="round" />
			<path d={`M ${-a} 0 L ${b} 0`} stroke="#8a5d38" strokeWidth={8} strokeLinecap="round" />
			<path d={`M ${b - 10} -16 L ${b + 55} 0 L ${b - 10} 16 Q ${b} 0 ${b - 10} -16 Z`} fill="#8e9298" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
			<path d={`M ${b - 20} -10 L ${b} 10 M ${b - 20} 10 L ${b} -10`} stroke="#5a3a1e" strokeWidth={4} />
		</g>
	);
};

export const Meat: React.FC<{s?: number; r?: number; bite?: boolean; cooked?: boolean}> = ({s = 1, r = 0, bite = false, cooked = false}) => (
	<g transform={`rotate(${r}) scale(${s})`}>
		<path d="M -10 20 L -70 70" stroke={OUT} strokeWidth={24} strokeLinecap="round" />
		<path d="M -10 20 L -70 70" stroke="#efe6d2" strokeWidth={14} strokeLinecap="round" />
		<circle cx={-76} cy={70} r={12} fill="#efe6d2" stroke={OUT} strokeWidth={4} />
		<circle cx={-66} cy={80} r={12} fill="#efe6d2" stroke={OUT} strokeWidth={4} />
		<path
			d={
				bite
					? 'M -40 10 Q -60 -50 0 -70 Q 40 -80 60 -50 Q 48 -40 56 -26 Q 44 -20 50 -4 Q 60 30 20 40 Q -30 50 -40 10 Z'
					: 'M -40 10 Q -60 -50 0 -70 Q 60 -80 70 -20 Q 70 30 20 40 Q -30 50 -40 10 Z'
			}
			fill={cooked ? '#9a4a2a' : '#c9564a'}
			stroke={OUT}
			strokeWidth={5}
			strokeLinejoin="round"
		/>
		<path d="M -20 -30 Q 10 -50 40 -30 M -10 0 Q 20 -15 45 0" stroke={cooked ? '#6b2e18' : '#f0b2a2'} strokeWidth={5} fill="none" strokeLinecap="round" />
	</g>
);

export const Basket: React.FC<{x: number; y: number; s?: number; fill?: number}> = ({x, y, s = 1, fill = 0}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		{Array.from({length: Math.round(fill * 9)}, (_, i) => (
			<circle key={i} cx={-45 + (i % 5) * 22 + (i > 4 ? 11 : 0)} cy={-18 - (i > 4 ? 16 : 0)} r={13} fill={i % 3 ? '#c0303a' : '#7a2a6a'} stroke={OUT} strokeWidth={4} />
		))}
		<path d="M -70 -20 L 70 -20 L 55 60 Q 0 72 -55 60 Z" fill="#b8894e" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
		<path d="M -64 5 L 64 5 M -60 30 L 60 30" stroke="#8a6232" strokeWidth={5} />
		{Array.from({length: 7}, (_, i) => (
			<path key={i} d={`M ${-54 + i * 18} -18 L ${-44 + i * 15} 60`} stroke="#8a6232" strokeWidth={4} />
		))}
	</g>
);

export const BerryBush: React.FC<{x: number; y: number; s?: number; seed?: number; berries?: number}> = ({
	x,
	y,
	s = 1,
	seed = 3,
	berries = 1,
}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		{Array.from({length: 6}, (_, i) => (
			<circle
				key={i}
				cx={(i - 2.5) * 55 + (rand(seed + i) - 0.5) * 20}
				cy={-60 - (i % 2) * 50 - rand(seed + i * 2) * 30}
				r={70 + rand(seed + i * 5) * 20}
				fill={i % 2 ? '#4f7a3a' : '#436a33'}
				stroke={OUT}
				strokeWidth={5}
			/>
		))}
		{Array.from({length: Math.round(18 * berries)}, (_, i) => (
			<circle
				key={`b${i}`}
				cx={(rand(seed + i * 9) - 0.5) * 300}
				cy={-40 - rand(seed + i * 11) * 150}
				r={11}
				fill="#c0303a"
				stroke={OUT}
				strokeWidth={3.5}
			/>
		))}
	</g>
);
