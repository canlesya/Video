import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S, blink, ease, lin, pop, talk} from '../anim';
import {wordAt} from '../captions';
import {Character} from '../components/Character';
import {OUT} from '../components/palette';
import {Basket, BerryBush, Grass, Ground, Ridge, Sky, Sun, Tree} from '../components/Scenery';
import {Badge, Cam, Label, Stage, TimeChip} from '../components/UI';

const Stick: React.FC<{angle: number}> = ({angle}) => (
	<g transform={`rotate(${angle})`}>
		<path d="M -60 0 L 260 0" stroke={OUT} strokeWidth={18} strokeLinecap="round" />
		<path d="M -60 0 L 260 0" stroke="#8a5d38" strokeWidth={9} strokeLinecap="round" />
	</g>
);

const Root: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M -10 30 q -10 30 -30 40 M 10 30 q 5 30 20 45" stroke="#6b4527" strokeWidth={5} fill="none" />
		<ellipse cx={0} cy={0} rx={55} ry={36} fill="#b07a45" stroke={OUT} strokeWidth={6} />
		<path d="M -20 -10 q 6 4 2 10 M 20 5 q 6 4 2 10" stroke="#7a5030" strokeWidth={4} fill="none" />
		<path d="M -5 -36 q -10 -40 -30 -50 M 5 -36 q 10 -40 35 -45" stroke="#5b8a3a" strokeWidth={10} fill="none" strokeLinecap="round" />
	</g>
);

const Nut: React.FC = () => (
	<g transform="scale(0.8)">
		<path d="M 0 -28 Q 28 -20 26 8 Q 22 34 0 36 Q -22 34 -26 8 Q -28 -20 0 -28 Z" fill="#a8703f" stroke={OUT} strokeWidth={5} />
		<path d="M -26 -6 Q 0 -30 26 -6 Q 0 -44 -26 -6 Z" fill="#6b4527" stroke={OUT} strokeWidth={4} />
	</g>
);
const Berry: React.FC = () => (
	<g transform="scale(0.8)">
		<circle cx={-10} cy={6} r={16} fill="#c0303a" stroke={OUT} strokeWidth={4} />
		<circle cx={12} cy={2} r={16} fill="#c0303a" stroke={OUT} strokeWidth={4} />
		<path d="M 0 -12 L 4 -30" stroke="#3b5a2a" strokeWidth={6} strokeLinecap="round" />
	</g>
);
const Leaf: React.FC = () => (
	<g transform="scale(0.8) rotate(-30)">
		<path d="M 0 30 Q -30 0 0 -34 Q 30 0 0 30 Z" fill="#5b8a3a" stroke={OUT} strokeWidth={4} />
		<path d="M 0 30 L 0 -24" stroke="#3b5a2a" strokeWidth={3} />
	</g>
);

export const Toplama: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const tMeyve = wordAt('toplama', 'meyve');
	const tKok = wordAt('toplama', 'kök');
	const tFindik = wordAt('toplama', 'fındık');
	const tBitki = wordAt('toplama', 'bitki');
	const tBesin = wordAt('toplama', 'besinin');
	const cyc = Math.sin(f * 0.18);
	const reach = (cyc + 1) / 2;
	const dig = Math.abs(Math.sin(f * 0.16));
	const rootUp = pop(f, tKok, 10);
	const basketFill = lin(f, [S(0.5), dur - 10], [0.1, 1]);
	return (
		<Stage>
			<Cam dur={dur} from={1.08} to={1.16} cy={1150}>
				<Sky stops={['#6fb1e0', '#a8d4ef', '#e4f2f8']} />
				<Sun x={880} y={260} r={60} t={f} />
				<Ridge y={930} amp={120} color="#9fb58a" seed={21} line="#71855e" />
				<Ground y={960} top="#c3b066" bottom="#8f8440" />
				<Tree x={110} y={1000} s={1.05} seed={11} color="#5b8a45" dark="#4a743a" />
				<BerryBush x={930} y={1160} s={1.0} seed={5} berries={1 - basketFill * 0.5} />
				<BerryBush x={560} y={1010} s={0.55} seed={9} />
				<Grass x={450} y={1180} s={1.1} color="#7a8f3c" />
				<Grass x={200} y={1330} s={1.2} color="#7a8f3c" />
				<Grass x={760} y={1350} s={0.9} color="#7a8f3c" />
				{/* toprak ve kök */}
				<ellipse cx={330} cy={1300} rx={90} ry={22} fill="#6b5230" stroke={OUT} strokeWidth={4} />
				{rootUp > 0.01 ? <Root x={400} y={1290 - rootUp * 120} s={rootUp} /> : null}
				<Character
					x={260}
					y={1030}
					scale={0.8}
					lean={14}
					skin="mid"
					hair="brown"
					pose={{lArm: [30, 20], rArm: [45, 10 + dig * 25], lLeg: [-10, 8], rLeg: [12, -6]}}
					rightItem={() => <Stick angle={60 - dig * 20} />}
					lid={blink(f, 0.35, 40)}
					lookX={0.6}
					lookY={1}
					mouth="flat"
				/>
				<Character
					x={700}
					y={1060}
					scale={0.85}
					female
					outfit="fur"
					hair="auburn"
					pose={{lArm: [-30, 80], rArm: [70 + reach * 40, -20 - reach * 30], lLeg: [-5, 3], rLeg: [5, -3]}}
					bodyItem={<Basket x={-60} y={-40} s={0.8} fill={basketFill} />}
					lid={blink(f, 0.3)}
					lookX={0.9}
					lookY={0.3}
					mouth={f > S(tBesin) ? 'open' : 'smile'}
					talk={f > S(tBesin) ? talk(f) * 0.6 : 0}
				/>
				{Array.from({length: 6}, (_, i) => {
					const period = 34;
					const p = ((f + i * period) % (period * 6)) / period;
					if (p > 1) return null;
					const x = 930 - p * 360;
					const y = 1040 - Math.sin(p * Math.PI) * 160 + p * 20;
					return <circle key={i} cx={x} cy={y} r={11} fill="#c0303a" stroke={OUT} strokeWidth={3.5} />;
				})}
			</Cam>
			<TimeChip time="08:00" label="Toplama" />
			<Badge x={300} y={340} text="Meyve" until={tBesin + 0.1} at={tMeyve} color="#ff8a8a" icon={<Berry />} />
			<Badge x={780} y={340} text="Kök" until={tBesin + 0.1} at={tKok} color="#e7c08a" icon={<Root x={0} y={0} s={0.45} />} />
			<Badge x={300} y={500} text="Fındık" until={tBesin + 0.1} at={tFindik} color="#f0d28a" icon={<Nut />} />
			<Badge x={780} y={500} text="Bitki" until={tBesin + 0.1} at={tBitki} color="#a8e08a" icon={<Leaf />} />
			<Label x={540} y={420} text="Besinin çoğu!" at={tBesin + 0.3} size={96} color="#ffd23f" rotate={-4} />
		</Stage>
	);
};
