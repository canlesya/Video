import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S, blink, pop} from '../anim';
import {wordAt} from '../captions';
import {Character, Pose} from '../components/Character';
import {OUT} from '../components/palette';
import {Acacia, Clouds, FurRug, Grass, Ground, Hut, Ridge, Sky, Spear, Tree} from '../components/Scenery';
import {Badge, Cam, Label, Stage, TimeChip, Zzz} from '../components/UI';

const Notebook: React.FC = () => (
	<g transform="rotate(-10) translate(10 -30)">
		<rect x={-45} y={-60} width={90} height={115} rx={6} fill="#fdfaf2" stroke={OUT} strokeWidth={5} />
		{[-35, -15, 5, 25].map((y) => (
			<path key={y} d={`M -30 ${y} L 30 ${y}`} stroke="#9aa0a6" strokeWidth={4} />
		))}
		{[-30, -10, 10, 30].map((x) => (
			<circle key={x} cx={x} cy={-60} r={5} fill="none" stroke={OUT} strokeWidth={3} />
		))}
	</g>
);
const Pencil: React.FC = () => (
	<g transform="rotate(-40)">
		<rect x={-6} y={-60} width={12} height={60} fill="#f2c14e" stroke={OUT} strokeWidth={3} />
		<path d="M -6 0 L 0 16 L 6 0 Z" fill="#e9c9a0" stroke={OUT} strokeWidth={3} />
	</g>
);
const Clock: React.FC<{f: number}> = ({f}) => (
	<g transform="scale(0.55)">
		<circle r={48} fill="#fdfaf2" stroke={OUT} strokeWidth={8} />
		<path d={`M 0 0 L 0 -32`} stroke={OUT} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f * 12})`} />
		<path d={`M 0 0 L 22 0`} stroke={OUT} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f})`} />
	</g>
);

const LYING: Pose = {lArm: [-170, 235], rArm: [15, -95], lLeg: [8, 0], rLeg: [-8, 0]};

export const Bos: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const tDort = wordAt('bos', 'dört');
	const tGerisi = wordAt('bos', 'gerisi');
	const tDin = wordAt('bos', 'dinlenmek');
	const tSoh = wordAt('bos', 'sohbet');
	const tUyku = wordAt('bos', 'uyku');
	const write = Math.sin(f * 0.6) * 8;
	const surprise = f > S(tDort) && f < S(tDort + 1.5);
	const stat = pop(f, tDort, 9);
	return (
		<Stage>
			<Cam dur={dur} from={1.08} to={1.16} cy={1120}>
				<Sky stops={['#71819a', '#9eaabb', '#c7ccd2']} />
				<Clouds t={f} y={100} color="#8392a6" line="#6c7a8e" rows={3} speed={0.5} />
				<Ridge y={900} amp={70} color="#8c96a3" seed={41} line="#6c7684" peaks={4} />
				<Ground y={930} top="#c9b184" bottom="#a38a5c" />
				<Hut x={420} y={1000} s={0.55} />
				<Hut x={700} y={980} s={0.4} />
				<Hut x={960} y={1010} s={0.6} />
				<Acacia x={640} y={940} s={0.55} />
				<Tree x={110} y={1260} s={1.25} seed={6} color="#6f8a4a" dark="#5b7440" />
				<Grass x={990} y={1300} s={1.2} color="#8a8a4a" />
				<Character
					x={250}
					y={1010}
					scale={0.8}
					outfit="khaki"
					hair="light"
					lean={-5}
					pose={{lArm: [20, 100], rArm: [10, -150 + write], lLeg: [8, -2], rLeg: [-10, 4]}}
					leftItem={() => <Notebook />}
					rightItem={() => <Pencil />}
					lid={surprise ? 0 : blink(f, 0.05)}
					lookX={surprise ? 0.2 : 0.8}
					lookY={surprise ? 0 : 0.7}
					brow={surprise ? 1 : 0.2}
					mouth={surprise ? 'o' : 'flat'}
				/>
				<FurRug x={640} y={1250} w={330} h={70} color="#b8966a" />
				<g transform="translate(650 1290)">
					<Spear angle={-3} len={380} />
				</g>
				<Character
					x={570}
					y={1215}
					scale={0.78}
					rotate={90}
					pose={LYING}
					skin="dark"
					hair="dark"
					curly
					beard={false}
					lid={1}
					mouth="smile"
				/>
				<Zzz x={840} y={1060} t={f} />
			</Cam>
			<TimeChip time="14:00" label="Boş zaman" />
			<g transform={`translate(540 360) scale(${stat}) rotate(${(1 - stat) * 10 - 3})`}>
				<rect x={-360} y={-95} width={720} height={190} rx={40} fill="rgba(0,0,0,0.35)" transform="translate(0 10)" />
				<rect x={-360} y={-95} width={720} height={190} rx={40} fill="#fdfaf2" stroke={OUT} strokeWidth={8} />
				<g transform="translate(-265 0)">
					<g transform="scale(2.4)">
						<Clock f={f} />
					</g>
				</g>
				<text x={70} y={-30} textAnchor="middle" fontFamily="Luckiest" fontSize={52} fill={OUT}>
					GÜNDE SADECE
				</text>
				<text x={70} y={52} textAnchor="middle" fontFamily="Luckiest" fontSize={96} fill="#e8322b">
					4-5 SAAT
				</text>
			</g>
			<Label x={540} y={1320} text="Gerisi mi?" at={tGerisi} size={90} color="#ffd23f" rotate={-4} until={tDin - 0.1} />
			<Badge x={300} y={1320} text="Dinlenmek" at={tDin} size={44} color="#a8e08a" />
			<Badge x={610} y={1320} text="Sohbet" at={tSoh} size={44} color="#7cc4ff" />
			<Badge x={850} y={1320} text="Uyku" at={tUyku} size={44} color="#d7b8ff" />
		</Stage>
	);
};
