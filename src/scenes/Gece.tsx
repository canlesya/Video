import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S, blink, pop, talk} from '../anim';
import {wordAt} from '../captions';
import {Character, POSES} from '../components/Character';
import {OUT} from '../components/palette';
import {Bone, Fire, Ground, Log, Meat, Moon, Stars, Tent, Tree} from '../components/Scenery';
import {Cam, Stage, TimeChip} from '../components/UI';

const Mammoth: React.FC = () => (
	<g>
		<path d="M -80 40 L -80 90 M -40 50 L -40 95 M 40 50 L 40 95 M 70 40 L 72 90" stroke="#6b4a2e" strokeWidth={26} strokeLinecap="round" />
		<path d="M -110 30 Q -120 -60 -20 -70 Q 70 -80 95 -20 Q 110 30 80 50 Q 0 70 -90 55 Z" fill="#7a5436" stroke={OUT} strokeWidth={6} />
		<path d="M 95 -20 Q 135 20 125 90 Q 118 100 108 90 Q 112 40 80 20" fill="#7a5436" stroke={OUT} strokeWidth={6} />
		<path d="M 100 10 Q 150 40 150 -10" stroke="#f4ecdc" strokeWidth={12} fill="none" strokeLinecap="round" />
		<path d="M 100 10 Q 150 40 150 -10" stroke={OUT} strokeWidth={3} fill="none" />
		<circle cx={80} cy={-25} r={6} fill={OUT} />
		<path d="M -60 -50 q 10 20 0 40 M -20 -60 q 10 20 0 40 M 20 -60 q 10 20 0 40" stroke="#5a3a22" strokeWidth={5} fill="none" />
	</g>
);

export const Gece: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const tHikaye = wordAt('gece', 'hikâyeler');
	const story = f > S(tHikaye) - 10;
	const bubble = pop(f, tHikaye - 0.2, 10);
	const gest = Math.sin(f * 0.2);
	return (
		<Stage>
			<Cam dur={dur} from={1.08} to={1.16} cy={1080}>
				<rect x={-200} y={-200} width={1480} height={2400} fill="#101a2e" />
				<defs>
					<linearGradient id="nightsky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#0d1628" />
						<stop offset="1" stopColor="#2a3a58" />
					</linearGradient>
				</defs>
				<rect x={-200} y={-200} width={1480} height={1200} fill="url(#nightsky)" />
				<Stars t={f} maxY={850} />
				<Moon x={760} y={330} r={85} />
				<Tree x={80} y={960} s={1.1} color="#253646" dark="#1c2a38" seed={3} />
				<Tree x={330} y={930} s={0.8} color="#253646" dark="#1c2a38" seed={8} />
				<Tree x={1010} y={950} s={1.05} color="#253646" dark="#1c2a38" seed={13} />
				<Ground y={930} top="#3b3a40" bottom="#2a2724" />
				<Tent x={150} y={1010} s={0.7} color="#5e4a38" />
				<Tent x={940} y={1000} s={0.62} flip color="#56432f" />
				<Bone x={130} y={1400} r={-20} />
				<Bone x={960} y={1420} r={15} s={0.9} />
				<Log x={540} y={1090} w={300} s={0.8} />
				<Character
					x={540}
					y={1040}
					scale={0.68}
					female
					outfit="fur"
					hair="auburn"
					pose={{...POSES.sit, lArm: [-10, 150], rArm: [10, -150]}}
					rightItem={() => <Meat s={0.8} r={-80} bite={f > S(1.5)} cooked />}
					lid={1}
					mouth="open"
					talk={0.3 + talk(f, 1.4) * 0.5}
				/>
				<Log x={220} y={1210} w={260} s={0.8} />
				<Character
					x={220}
					y={1150}
					scale={0.72}
					pose={{...POSES.sit, rArm: [40, 60]}}
					rightItem={() => <Meat s={0.9} r={-30} cooked />}
					lid={story ? blink(f, 0.2) : 1}
					lookX={story ? 1 : 0}
					mouth={story ? 'o' : 'smile'}
				/>
				<Log x={870} y={1210} w={260} s={0.8} />
				<Character
					x={860}
					y={1150}
					scale={0.72}
					skin="mid"
					hair="dark"
					pose={{
						...POSES.sit,
						lArm: story ? [-120 + gest * 25, -40] : [-18, 55],
						rArm: story ? [110 - gest * 20, 40] : [18, -55],
					}}
					lid={story ? 0 : blink(f, 0.3, 20)}
					lookX={-0.8}
					brow={story ? 0.8 : 0}
					mouth={story ? 'open' : 'smile'}
					talk={story ? talk(f) : 0}
				/>
				{/* şişte et */}
				<path d="M 380 1260 L 400 1120 M 700 1260 L 680 1120" stroke={OUT} strokeWidth={16} strokeLinecap="round" />
				<path d="M 380 1260 L 400 1120 M 700 1260 L 680 1120" stroke="#6b4527" strokeWidth={8} strokeLinecap="round" />
				<Fire x={540} y={1300} s={0.85} t={f} intensity={1} />
				<path d="M 370 1130 L 710 1130" stroke={OUT} strokeWidth={14} strokeLinecap="round" />
				<path d="M 370 1130 L 710 1130" stroke="#8a5d38" strokeWidth={7} strokeLinecap="round" />
				<g transform={`translate(540 1130) rotate(${f * 3})`}>
					<ellipse rx={60} ry={42} fill="#9a4a2a" stroke={OUT} strokeWidth={5} />
					<path d="M -30 -10 Q 0 -25 30 -10" stroke="#6b2e18" strokeWidth={5} fill="none" />
				</g>
			</Cam>
			<TimeChip time="20:00" label="Gece" night />
			{bubble > 0.01 ? (
				<g transform={`translate(560 520) scale(${bubble})`}>
					<path d="M 180 120 L 260 230 L 110 140 Z" fill="#fdfaf2" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
					<ellipse rx={300} ry={170} fill="#fdfaf2" stroke={OUT} strokeWidth={7} />
					<path d="M 150 120 L 200 150" stroke="#fdfaf2" strokeWidth={14} />
					<g transform="translate(-40 10) scale(1.05)">
						<Mammoth />
					</g>
					<g transform="translate(-230 60) scale(0.5)">
						<path d="M 0 -60 L 0 20 M 0 -30 L -30 0 M 0 -30 L 40 -50 M 0 20 L -20 70 M 0 20 L 20 70" stroke={OUT} strokeWidth={10} strokeLinecap="round" />
						<circle cx={0} cy={-80} r={20} fill="none" stroke={OUT} strokeWidth={10} />
						<path d="M 40 -50 L 110 -90" stroke="#8a5d38" strokeWidth={10} strokeLinecap="round" />
					</g>
				</g>
			) : null}
		</Stage>
	);
};
