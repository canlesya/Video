import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S, blink, ease, lin} from '../anim';
import {wordAt} from '../captions';
import {Character, POSES} from '../components/Character';
import {OUT, rand} from '../components/palette';
import {Rock} from '../components/Scenery';
import {Badge, Cam, Label, Stage, TimeChip} from '../components/UI';

const PAINT = '#a3401f';
const INK = '#2a1a10';

// Mağara resimleri (çizgiler sırayla "çizilir")
const PAINTINGS: {d: string; c: string; w: number}[] = [
	// bizon
	{d: 'M 160 520 Q 170 440 260 430 Q 330 380 400 420 Q 460 430 470 490 Q 480 540 440 560 L 440 620 M 420 560 Q 330 575 250 560 L 240 625 M 250 560 Q 200 560 180 540 L 170 610 M 160 520 Q 140 480 170 460 M 175 470 Q 150 440 165 420', c: INK, w: 10},
	{d: 'M 270 470 Q 330 450 400 470 Q 420 510 380 530 Q 320 540 270 520 Z', c: PAINT, w: 26},
	// geyik
	{d: 'M 640 560 Q 700 520 780 540 Q 820 545 830 520 L 860 470 M 845 490 L 880 440 M 855 470 L 830 430 M 640 560 L 625 630 M 660 565 L 670 630 M 770 560 L 760 630 M 800 555 L 815 625 M 640 560 Q 620 545 615 530', c: PAINT, w: 10},
	// avcılar (çöp adamlar)
	{d: 'M 520 700 L 520 760 M 520 720 L 490 745 M 520 720 L 555 700 L 600 690 M 520 760 L 500 800 M 520 760 L 540 800 M 520 690 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0', c: INK, w: 8},
	{d: 'M 430 710 L 430 770 M 430 730 L 400 750 M 430 730 L 465 712 L 510 702 M 430 770 L 410 810 M 430 770 L 450 810 M 430 700 m -12 0 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0', c: INK, w: 8},
];

const Hand: React.FC<{x: number; y: number; r: number; o: number}> = ({x, y, r, o}) => (
	<g transform={`translate(${x} ${y}) rotate(${r})`} opacity={o}>
		<path
			d="M -30 40 L -34 -10 L -46 -40 Q -44 -50 -34 -44 L -20 -18 L -22 -70 Q -16 -80 -8 -70 L -4 -24 L 0 -80 Q 8 -88 14 -78 L 12 -24 L 22 -70 Q 30 -76 34 -66 L 26 -14 L 36 -44 Q 44 -48 44 -38 L 32 20 Q 28 44 -30 40 Z"
			fill={PAINT}
			opacity={0.85}
		/>
	</g>
);

export const Alet: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const tResim = wordAt('alet', 'resimler');
	const tBazi = wordAt('alet', 'bazıları');
	const hit = Math.max(0, Math.sin(f * 0.42));
	const hitNow = Math.sin(f * 0.42) > 0.96;
	const draw = lin(f, [S(tResim - 1.2), S(tResim + 2.2)], [0, 1]);
	const torch = 0.85 + 0.15 * Math.sin(f * 0.7) * Math.sin(f * 0.31);
	return (
		<Stage>
			<Cam dur={dur} from={1.05} to={1.12} cy={900}>
				{/* mağara duvarı */}
				<rect x={-200} y={-200} width={1480} height={2400} fill="#6a4e3b" />
				{Array.from({length: 30}, (_, i) => (
					<ellipse
						key={i}
						cx={rand(i) * 1080}
						cy={rand(i + 11) * 1100}
						rx={60 + rand(i + 2) * 120}
						ry={30 + rand(i + 3) * 60}
						fill={i % 2 ? '#5d4331' : '#765842'}
						opacity={0.6}
					/>
				))}
				<defs>
					<radialGradient id="torchlight">
						<stop offset="0" stopColor="#ffb85a" stopOpacity={0.5} />
						<stop offset="1" stopColor="#ffb85a" stopOpacity={0} />
					</radialGradient>
				</defs>
				<circle cx={960} cy={380} r={700 * torch} fill="url(#torchlight)" />
				{PAINTINGS.map((p, i) => {
					const k = Math.max(0, Math.min(1, draw * PAINTINGS.length - i));
					return (
						<path
							key={i}
							d={p.d}
							stroke={p.c}
							strokeWidth={p.w}
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							pathLength={1}
							strokeDasharray="1 1"
							strokeDashoffset={1 - k}
							opacity={0.9}
						/>
					);
				})}
				<Hand x={900} y={700} r={15} o={ease(f, [S(tResim + 0.8), S(tResim + 1.3)], [0, 1])} />
				<Hand x={990} y={620} r={-10} o={ease(f, [S(tResim + 1.2), S(tResim + 1.7)], [0, 1])} />
				{/* meşale */}
				<g transform="translate(960 380)">
					<path d="M 0 0 L -20 160" stroke={OUT} strokeWidth={26} strokeLinecap="round" />
					<path d="M 0 0 L -20 160" stroke="#7a5030" strokeWidth={16} strokeLinecap="round" />
					<path
						d={`M -30 0 Q -40 -60 ${Math.sin(f * 0.5) * 12} -${110 * torch} Q 40 -60 30 0 Z`}
						fill="#f0582a"
						stroke={OUT}
						strokeWidth={5}
					/>
					<path d={`M -16 -4 Q -20 -40 ${Math.sin(f * 0.6) * 8} -${70 * torch} Q 20 -40 16 -4 Z`} fill="#ffd06a" />
				</g>
				{/* zemin */}
				<path d="M -200 1000 Q 540 950 1280 1010 L 1280 2200 L -200 2200 Z" fill="#4e3a2c" stroke={OUT} strokeWidth={6} />
				<Rock x={290} y={1210} w={120} h={70} seed={8} color="#7a7c82" />
				<Character
					x={290}
					y={1140}
					scale={0.82}
					pose={{...POSES.sit, lArm: [-10, 95], rArm: [60 - hit * 70, -30 - hit * 40]}}
					leftItem={() => (
						<path d="M -10 -40 L 40 -30 L 55 10 L 20 30 L -20 10 Z" fill="#6f7a86" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
					)}
					rightItem={() => <ellipse cx={0} cy={-10} rx={28} ry={22} fill="#9a9ca1" stroke={OUT} strokeWidth={5} />}
					lid={blink(f, 0.4)}
					lookX={0.3}
					lookY={1}
					brow={-0.3}
					mouth="flat"
				/>
				{Array.from({length: 5}, (_, i) => {
					const life = ((f + i * 7) % 30) / 30;
					return (
						<path
							key={i}
							d="M 0 -8 L 8 4 L -6 6 Z"
							transform={`translate(${345 + (rand(i) - 0.5) * 40 + life * (rand(i + 3) - 0.3) * 220} ${860 - Math.sin(life * Math.PI) * 120 + life * 80}) rotate(${life * 400})`}
							fill="#8e9298"
							stroke={OUT}
							strokeWidth={3}
							opacity={1 - life}
						/>
					);
				})}
				<Character
					x={800}
					y={1060}
					scale={0.8}
					female
					outfit="fur"
					hair="brown"
					skin="mid"
					pose={{lArm: [-15, 10], rArm: [150 + Math.sin(f * 0.3) * 10, 20], lLeg: [-4, 2], rLeg: [4, -2]}}
					rightItem={() => <circle r={12} fill={PAINT} stroke={OUT} strokeWidth={4} />}
					lid={blink(f, 0.25, 30)}
					lookX={0.2}
					lookY={-1}
					mouth="smile"
				/>
			</Cam>
			<TimeChip time="16:00" label="Alet ve sanat" />
			{hitNow && f < S(tResim) ? <Label x={200} y={620} text="Tak!" at={f / 30 - 0.05} size={90} color="#ffd23f" rotate={-12} /> : null}
			<Badge x={540} y={330} text="Lascaux, Fransa" at={tBazi} size={50} color="#ffd23f" />
			<Label x={540} y={450} text="~17.000 yıllık!" at={tBazi + 0.4} size={80} color="#ffffff" rotate={-3} />
		</Stage>
	);
};
