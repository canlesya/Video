import React, {useId} from 'react';
import {FUR, HAIR, KHAKI, LEOPARD, OUT, SKIN, rand} from './palette';

// Karakterin orijini kalça merkezidir (0,0). Ayakta dururken ayaklar ~y=+390,
// başın tepesi ~y=-460. Açılar derece cinsinden: 0 = aşağı, 90 = sağa (+x),
// -90 = sola, 180 = yukarı. Alt kol/bacak açısı üst parçaya göre görecelidir.

export type Limb = [number, number];
export type Pose = {lArm: Limb; rArm: Limb; lLeg: Limb; rLeg: Limb; thigh?: number};

export const POSES: Record<'stand' | 'sit' | 'stretch', Pose> = {
	stand: {lArm: [-12, 8], rArm: [12, -8], lLeg: [-4, 2], rLeg: [4, -2]},
	sit: {lArm: [-18, 55], rArm: [18, -55], lLeg: [-70, 68], rLeg: [70, -68], thigh: 90},
	stretch: {lArm: [-150, -15], rArm: [150, 15], lLeg: [-4, 2], rLeg: [4, -2]},
};

export type ItemFn = (forearmAngle: number) => React.ReactNode;

export type CharacterProps = {
	x: number;
	y: number;
	scale?: number;
	flip?: boolean;
	rotate?: number;
	skin?: keyof typeof SKIN;
	hair?: keyof typeof HAIR;
	outfit?: 'leopard' | 'fur' | 'khaki';
	female?: boolean;
	beard?: boolean;
	curly?: boolean;
	/** 0 = açık göz, 1 = kapalı */
	lid?: number;
	lookX?: number;
	lookY?: number;
	/** kaş: pozitif = üzgün/şaşkın (iç uçlar yukarı), negatif = kızgın */
	brow?: number;
	browY?: number;
	mouth?: 'smile' | 'flat' | 'o' | 'open' | 'frown' | 'grin' | 'none';
	/** konuşma / çiğneme için ağız açıklığı 0..1 */
	talk?: number;
	cheeks?: boolean;
	pose?: Pose;
	lean?: number;
	headTilt?: number;
	leftItem?: ItemFn;
	rightItem?: ItemFn;
	/** kolların arkasında, gövdenin önünde çizilen nesne (ör. sepet) */
	bodyItem?: React.ReactNode;
};

const rad = (d: number) => (d * Math.PI) / 180;

const limbPts = (x: number, y: number, a1: number, rel: number, l1: number, l2: number) => {
	const a2 = a1 + rel;
	const kx = x + l1 * Math.sin(rad(a1));
	const ky = y + l1 * Math.cos(rad(a1));
	const ex = kx + l2 * Math.sin(rad(a2));
	const ey = ky + l2 * Math.cos(rad(a2));
	return {kx, ky, ex, ey, a2};
};

/** Dağınık saç / sakal kenarı: elips etrafında sivri tutamlar */
export const shaggy = (
	cx: number,
	cy: number,
	rx: number,
	ry: number,
	n: number,
	jag: number,
	seed: number,
	a0 = 0,
	a1 = 360,
	closed = true,
) => {
	const pts: string[] = [];
	const step = (a1 - a0) / n;
	for (let i = 0; i <= n; i++) {
		const a = a0 + step * i;
		const valley = 1 - jag * 0.25 * rand(seed + i * 3.1);
		const vx = cx + rx * valley * Math.cos(rad(a));
		const vy = cy + ry * valley * Math.sin(rad(a));
		if (i === 0) {
			pts.push(`M ${vx.toFixed(1)} ${vy.toFixed(1)}`);
			continue;
		}
		const am = a - step / 2 + step * 0.25 * (rand(seed + i) - 0.5);
		const tip = 1 + jag * (0.5 + 0.6 * rand(seed + i * 7.7));
		const tx = cx + rx * tip * Math.cos(rad(am));
		const ty = cy + ry * tip * Math.sin(rad(am));
		const ca = am - step * 0.45;
		const cxp = cx + rx * (1 + jag * 0.2) * Math.cos(rad(ca));
		const cyp = cy + ry * (1 + jag * 0.2) * Math.sin(rad(ca));
		pts.push(`Q ${cxp.toFixed(1)} ${cyp.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`);
		pts.push(`L ${vx.toFixed(1)} ${vy.toFixed(1)}`);
	}
	return pts.join(' ') + (closed ? ' Z' : '');
};

const Tube: React.FC<{
	d: string;
	w: number;
	color: string;
}> = ({d, w, color}) => (
	<>
		<path d={d} stroke={OUT} strokeWidth={w + 11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		<path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
	</>
);

const Eye: React.FC<{
	cx: number;
	cy: number;
	lid: number;
	lookX: number;
	lookY: number;
	skin: string;
}> = ({cx, cy, lid, lookX, lookY, skin}) => {
	const rx = 26;
	const ry = 31;
	const l = Math.max(0, Math.min(1, lid));
	const L = cy - ry + 2 * ry * l; // göz kapağının alt kenarı
	const t = (L - cy) / ry;
	const dx = rx * Math.sqrt(Math.max(0, 1 - t * t));
	const large = L > cy ? 1 : 0;
	if (l >= 0.95) {
		return (
			<g>
				<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={skin} stroke={OUT} strokeWidth={5} />
				<path d={`M ${cx - rx * 0.85} ${cy + ry * 0.15} Q ${cx} ${cy + ry * 0.6} ${cx + rx * 0.85} ${cy + ry * 0.15}`} stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
			</g>
		);
	}
	return (
		<g>
			<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fdfaf2" />
			{l < 0.92 ? <circle cx={cx + lookX * 12} cy={cy + 4 + lookY * 12} r={7.5} fill="#15100c" /> : null}
			{l > 0.02 ? (
				<>
					<path
						d={`M ${cx - dx} ${L} A ${rx} ${ry} 0 ${large} 1 ${cx + dx} ${L} Z`}
						fill={skin}
					/>
					<path d={`M ${cx - dx} ${L} Q ${cx} ${L + 5} ${cx + dx} ${L}`} stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
				</>
			) : null}
			<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={OUT} strokeWidth={5} />
		</g>
	);
};

export const Character: React.FC<CharacterProps> = ({
	x,
	y,
	scale = 1,
	flip = false,
	rotate = 0,
	skin = 'light',
	hair = 'brown',
	outfit = 'leopard',
	female = false,
	beard = !female,
	curly = false,
	lid = 0.35,
	lookX = 0,
	lookY = 0,
	brow = 0,
	browY = 0,
	mouth = 'flat',
	talk = 0,
	cheeks = false,
	pose = POSES.stand,
	lean = 0,
	headTilt = 0,
	leftItem,
	rightItem,
	bodyItem,
}) => {
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const s = SKIN[skin];
	const hc = HAIR[hair];
	const seed = (hc.length + skin.length) * 3 + (female ? 11 : 0) + (curly ? 5 : 0);
	const khaki = outfit === 'khaki';
	const thigh = pose.thigh ?? 195;

	// Bacaklar
	const legs = ([-30, 30] as const).map((hx, i) => {
		const lg = i === 0 ? pose.lLeg : pose.rLeg;
		const p = limbPts(hx, 0, lg[0], lg[1], thigh, 185);
		const side = i === 0 ? -1 : 1;
		const d = `M ${hx} 0 L ${p.kx} ${p.ky} L ${p.ex} ${p.ey}`;
		return (
			<g key={i}>
				<Tube d={d} w={khaki ? 40 : 27} color={khaki ? KHAKI.pants : s.base} />
				{khaki ? (
					<path
						d={`M ${p.ex + side * 10 - 34} ${p.ey + 14} q 0 -34 30 -34 q 36 0 40 34 z`}
						fill={KHAKI.boot}
						stroke={OUT}
						strokeWidth={6}
						strokeLinejoin="round"
					/>
				) : (
					<ellipse cx={p.ex + side * 14} cy={p.ey + 6} rx={36} ry={15} fill={s.base} stroke={OUT} strokeWidth={6} />
				)}
			</g>
		);
	});

	// Kollar (el konumlarını da hesapla)
	const arms = ([-64, 64] as const).map((sx, i) => {
		const am = i === 0 ? pose.lArm : pose.rArm;
		const p = limbPts(sx, -215, am[0], am[1], 150, 138);
		const item = i === 0 ? leftItem : rightItem;
		const upper = `M ${sx} -215 L ${p.kx} ${p.ky}`;
		const whole = `${upper} L ${p.ex} ${p.ey}`;
		return (
			<g key={i}>
				<Tube d={whole} w={20} color={s.base} />
				{khaki ? <Tube d={upper} w={30} color={KHAKI.shirt} /> : null}
				{item ? <g transform={`translate(${p.ex} ${p.ey})`}>{item(p.a2)}</g> : null}
				<circle cx={p.ex} cy={p.ey} r={17} fill={s.base} stroke={OUT} strokeWidth={6} />
			</g>
		);
	});

	const torso = 'M -64 -228 Q -72 -120 -50 4 L 50 4 Q 72 -120 64 -228 Q 0 -250 -64 -228 Z';

	let clothes: React.ReactNode = null;
	if (outfit === 'leopard') {
		const wrap =
			'M -72 -232 L -30 -236 Q 12 -170 66 -140 L 58 0 L 86 112 L 64 96 L 50 124 L 30 98 L 12 128 L -8 100 L -28 126 L -46 98 L -64 122 L -88 108 L -58 0 L -64 -120 Z';
		const spots = Array.from({length: 26}, (_, k) => {
			const sx = -80 + rand(k * 2.3 + 1) * 165;
			const sy = -235 + rand(k * 5.1 + 2) * 360;
			return <ellipse key={k} cx={sx} cy={sy} rx={7 + rand(k) * 6} ry={5 + rand(k + 9) * 5} fill={LEOPARD.spot} opacity={0.85} />;
		});
		clothes = (
			<g>
				<clipPath id={`w${uid}`}>
					<path d={wrap} />
				</clipPath>
				<path d={wrap} fill={LEOPARD.base} />
				<g clipPath={`url(#w${uid})`}>
					<path d="M 20 -200 L 90 -200 L 90 130 L 40 130 Z" fill={LEOPARD.shade} opacity={0.5} />
					{spots}
				</g>
				<path d={wrap} fill="none" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
				<path d="M -60 -6 Q 0 8 60 -6" stroke={LEOPARD.spot} strokeWidth={8} fill="none" strokeLinecap="round" />
			</g>
		);
	} else if (outfit === 'fur') {
		const dress =
			'M -64 -200 L -54 -232 L -34 -230 L -30 -200 L -12 -206 L 6 -196 L 24 -206 L 44 -196 L 64 -204 L 56 -100 L 54 0 L 92 176 L 70 160 L 58 188 L 38 164 L 20 192 L 0 166 L -20 192 L -38 164 L -58 188 L -70 160 L -92 176 L -54 0 L -58 -100 Z';
		const tufts = Array.from({length: 22}, (_, k) => {
			const fx = -70 + rand(k * 3.3) * 140;
			const fy = -190 + rand(k * 1.7 + 4) * 350;
			return (
				<path
					key={k}
					d={`M ${fx} ${fy} l ${4 + rand(k) * 6} ${12 + rand(k + 3) * 8}`}
					stroke={k % 2 ? FUR.light : FUR.dark}
					strokeWidth={4}
					strokeLinecap="round"
				/>
			);
		});
		clothes = (
			<g>
				<clipPath id={`f${uid}`}>
					<path d={dress} />
				</clipPath>
				<path d={dress} fill={FUR.base} />
				<g clipPath={`url(#f${uid})`}>{tufts}</g>
				<path d={dress} fill="none" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
				<path d="M -58 -12 Q 0 4 58 -12" stroke={FUR.dark} strokeWidth={10} fill="none" strokeLinecap="round" />
			</g>
		);
	} else {
		clothes = (
			<g>
				<path d={torso} fill={KHAKI.shirt} stroke={OUT} strokeWidth={6} />
				<path d="M -20 -236 L 0 -200 L 20 -236" fill={s.base} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
				<path d="M -66 -226 L -24 -232 L -10 -150 L -12 6 L -52 6 Q -72 -110 -66 -226 Z" fill={KHAKI.vest} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
				<path d="M 66 -226 L 24 -232 L 10 -150 L 12 6 L 52 6 Q 72 -110 66 -226 Z" fill={KHAKI.vest} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
				<rect x={-54} y={-150} width={32} height={34} rx={4} fill={KHAKI.vest} stroke={OUT} strokeWidth={4} />
				<rect x={22} y={-150} width={32} height={34} rx={4} fill={KHAKI.vest} stroke={OUT} strokeWidth={4} />
				<rect x={-54} y={-70} width={34} height={40} rx={4} fill={KHAKI.vest} stroke={OUT} strokeWidth={4} />
				<rect x={20} y={-70} width={34} height={40} rx={4} fill={KHAKI.vest} stroke={OUT} strokeWidth={4} />
				<rect x={-54} y={-8} width={108} height={16} fill="#4a3b26" stroke={OUT} strokeWidth={4} />
			</g>
		);
	}

	// Kafa
	const mouthY = -276;
	const open = Math.max(0, Math.min(1, talk));
	let mouthEl: React.ReactNode = null;
	if (open > 0.05 || mouth === 'open') {
		const o = mouth === 'open' ? Math.max(open, 0.6) : open;
		mouthEl = (
			<ellipse cx={0} cy={mouthY + 2} rx={17} ry={3 + 13 * o} fill="#5a1d16" stroke={OUT} strokeWidth={5} />
		);
	} else if (mouth === 'smile') {
		mouthEl = <path d={`M -24 ${mouthY - 6} Q 0 ${mouthY + 16} 24 ${mouthY - 6}`} stroke={OUT} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
	} else if (mouth === 'grin') {
		mouthEl = (
			<path
				d={`M -28 ${mouthY - 8} Q 0 ${mouthY + 30} 28 ${mouthY - 8} Z`}
				fill="#fdfaf2"
				stroke={OUT}
				strokeWidth={5}
				strokeLinejoin="round"
			/>
		);
	} else if (mouth === 'frown') {
		mouthEl = <path d={`M -20 ${mouthY + 8} Q 0 ${mouthY - 8} 20 ${mouthY + 8}`} stroke={OUT} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
	} else if (mouth === 'o') {
		mouthEl = <ellipse cx={0} cy={mouthY + 2} rx={9} ry={11} fill="#5a1d16" stroke={OUT} strokeWidth={5} />;
	} else if (mouth === 'flat') {
		mouthEl = <path d={`M -16 ${mouthY} Q 0 ${mouthY + 3} 16 ${mouthY}`} stroke={OUT} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
	}

	const backHair = curly ? (
		<g>
			{Array.from({length: 16}, (_, k) => {
				const a = rad(180 + (k / 15) * 180 - 10 + rand(k) * 20);
				const r = 88 + rand(k + 5) * 16;
				return (
					<circle
						key={k}
						cx={Math.cos(a) * r}
						cy={-360 + Math.sin(a) * r * 0.95}
						r={36 + rand(k * 2) * 10}
						fill={hc}
						stroke={OUT}
						strokeWidth={5}
					/>
				);
			})}
		</g>
	) : (
		<path
			d={shaggy(0, female ? -322 : -332, female ? 122 : 106, female ? 136 : 118, 22, 0.16, seed)}
			fill={hc}
			stroke={OUT}
			strokeWidth={6}
			strokeLinejoin="round"
		/>
	);

	const fringe = curly
		? null
		: (() => {
				const top = shaggy(0, -350, 84, 100, 9, 0.16, seed + 40, 192, 348, false);
				const inner: string[] = [];
				const n = 8;
				for (let k = 0; k <= n; k++) {
					const fx = 76 - (152 * k) / n;
					const fy = -420 + Math.abs(fx) * 0.22 + (k % 2 === 0 ? 0 : 14 + rand(k + seed) * 8);
					inner.push(`L ${fx.toFixed(1)} ${fy.toFixed(1)}`);
				}
				return (
					<path d={`${top} ${inner.join(' ')} Z`} fill={hc} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
				);
			})();

	const beardEl = beard ? (
		<path
			d={`${shaggy(0, -318, 72, 92, 12, 0.1, seed + 80, -8, 188, false)} Q -46 -300 -24 -304 Q 0 -310 24 -304 Q 46 -300 70 -338 Z`}
			fill={hc}
			stroke={OUT}
			strokeWidth={6}
			strokeLinejoin="round"
		/>
	) : null;

	const nose = female
		? 'M -4 -346 C -6 -326 -14 -312 -10 -304 C -6 -297 6 -297 11 -303 C 14 -309 8 -313 4 -316 C 2 -328 4 -340 4 -346'
		: 'M -6 -350 C -8 -326 -20 -310 -16 -298 C -12 -287 6 -286 15 -293 C 23 -300 15 -310 7 -313 C 4 -328 6 -342 8 -350';

	const head = (
		<g transform={`rotate(${headTilt} 0 -250)`}>
			<ellipse cx={-70} cy={-340} rx={14} ry={22} fill={s.base} stroke={OUT} strokeWidth={5} />
			<ellipse cx={70} cy={-340} rx={14} ry={22} fill={s.base} stroke={OUT} strokeWidth={5} />
			<ellipse cx={0} cy={-338} rx={70} ry={90} fill={s.base} stroke={OUT} strokeWidth={6} />
			{cheeks ? (
				<>
					<circle cx={-34} cy={-292} r={22} fill={s.base} stroke={OUT} strokeWidth={4} />
					<circle cx={34} cy={-292} r={22} fill={s.base} stroke={OUT} strokeWidth={4} />
				</>
			) : null}
			{beardEl}
			{mouthEl}
			{beard ? (
				<path d="M -30 -290 Q -14 -302 0 -294 Q 14 -302 30 -290 Q 14 -284 0 -289 Q -14 -284 -30 -290 Z" fill={hc} stroke={OUT} strokeWidth={4} />
			) : null}
			{female ? (
				<>
					<circle cx={-44} cy={-306} r={10} fill="#e58a7a" opacity={0.45} />
					<circle cx={44} cy={-306} r={10} fill="#e58a7a" opacity={0.45} />
				</>
			) : null}
			<path d={nose} fill={s.base} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
			<Eye cx={-26} cy={-362} lid={lid} lookX={lookX} lookY={lookY} skin={s.base} />
			<Eye cx={26} cy={-362} lid={lid} lookX={lookX} lookY={lookY} skin={s.base} />
			{fringe}
			{curly ? (
				<path d={shaggy(0, -420, 70, 30, 8, 0.4, seed + 3, 180, 360)} fill={hc} stroke={OUT} strokeWidth={5} />
			) : null}
			<path
				d={`M -54 ${-398 + browY} L -12 ${-404 + browY - brow * 12}`}
				stroke={hair === 'dark' ? '#140c08' : OUT}
				strokeWidth={9}
				strokeLinecap="round"
			/>
			<path
				d={`M 54 ${-398 + browY} L 12 ${-404 + browY - brow * 12}`}
				stroke={hair === 'dark' ? '#140c08' : OUT}
				strokeWidth={9}
				strokeLinecap="round"
			/>
			{female ? (
				<>
					<path d="M -50 -388 l -9 -8 M -44 -392 l -5 -10" stroke={OUT} strokeWidth={4} strokeLinecap="round" />
					<path d="M 50 -388 l 9 -8 M 44 -392 l 5 -10" stroke={OUT} strokeWidth={4} strokeLinecap="round" />
				</>
			) : null}
		</g>
	);

	return (
		<g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -scale : scale} ${scale})`}>
			{legs}
			<g transform={`rotate(${lean} 0 0)`}>
				<g transform={`rotate(${headTilt * 0.6} 0 -250)`}>{backHair}</g>
				<path d={torso} fill={s.base} stroke={OUT} strokeWidth={6} />
				{outfit === 'leopard' ? (
					<>
						<circle cx={38} cy={-176} r={4} fill={s.shade} />
						<path d="M 18 -214 Q 40 -206 56 -214" stroke={s.shade} strokeWidth={4} fill="none" strokeLinecap="round" />
					</>
				) : null}
				{clothes}
				<path d="M -22 -270 L -22 -222 Q 0 -212 22 -222 L 22 -270 Z" fill={s.shade} stroke={OUT} strokeWidth={5} />
				{bodyItem}
				{arms}
				{head}
			</g>
		</g>
	);
};
