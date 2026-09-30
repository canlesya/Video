import React from 'react';
import {useCurrentFrame} from 'remotion';
import {blink, ease, lerpPose, pop} from '../anim';
import {wordAt} from '../captions';
import {Character, POSES} from '../components/Character';
import {OUT} from '../components/palette';
import {Bone, Ground, Grass, Ridge, Rock, Sky, Sun, Tent, Tree} from '../components/Scenery';
import {Cam, Cross, Label, Stage} from '../components/UI';

const Alarm: React.FC = () => (
	<g>
		<path d="M -70 -60 L -95 -85 M 70 -60 L 95 -85" stroke={OUT} strokeWidth={16} strokeLinecap="round" />
		<circle cx={-62} cy={-78} r={24} fill="#e8b43c" stroke={OUT} strokeWidth={6} />
		<circle cx={62} cy={-78} r={24} fill="#e8b43c" stroke={OUT} strokeWidth={6} />
		<path d="M -50 70 L -70 95 M 50 70 L 70 95" stroke={OUT} strokeWidth={12} strokeLinecap="round" />
		<circle r={85} fill="#e84a3c" stroke={OUT} strokeWidth={7} />
		<circle r={66} fill="#fdfaf2" stroke={OUT} strokeWidth={5} />
		<path d="M 0 0 L 0 -45 M 0 0 L 32 18" stroke={OUT} strokeWidth={9} strokeLinecap="round" />
	</g>
);

const Briefcase: React.FC = () => (
	<g>
		<path d="M -35 -60 L -35 -85 L 35 -85 L 35 -60" stroke={OUT} strokeWidth={14} fill="none" strokeLinejoin="round" />
		<rect x={-95} y={-60} width={190} height={130} rx={16} fill="#8a5a34" stroke={OUT} strokeWidth={7} />
		<path d="M -95 -10 L 95 -10" stroke={OUT} strokeWidth={6} />
		<rect x={-18} y={-22} width={36} height={26} rx={4} fill="#e8b43c" stroke={OUT} strokeWidth={5} />
	</g>
);

const Bill: React.FC = () => (
	<g>
		<path d="M -70 -95 L 70 -95 L 70 95 L 55 80 L 40 95 L 25 80 L 10 95 L -5 80 L -20 95 L -35 80 L -50 95 L -70 80 Z" fill="#fdfaf2" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
		<path d="M -45 -55 L 45 -55 M -45 -25 L 30 -25 M -45 5 L 45 5" stroke="#9aa0a6" strokeWidth={9} strokeLinecap="round" />
		<text x={0} y={60} textAnchor="middle" fontFamily="Luckiest" fontSize={52} fill="#e84a3c">
			TL
		</text>
	</g>
);

export const Hook: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const tAlarm = wordAt('hook', 'alarm');
	const tIs = wordAt('hook', 'iş');
	const tFatura = wordAt('hook', 'fatura');
	const tPeki = wordAt('hook', 'peki');
	const icons = [
		{t: tAlarm, x: 210, el: <Alarm />},
		{t: tIs, x: 540, el: <Briefcase />},
		{t: tFatura, x: 870, el: <Bill />},
	];
	const iconsOut = ease(f, [tPeki * 30 - 6, tPeki * 30 + 4], [1, 0]);
	const shrug = ease(f, [tPeki * 30, tPeki * 30 + 10], [0, 1]);
	const current = icons.filter((i) => f >= i.t * 30).length - 1;
	const pose = lerpPose(POSES.stand, {...POSES.stand, lArm: [-40, -110], rArm: [40, 110]}, shrug);
	return (
		<Stage>
			<Cam dur={dur} from={1.02} to={1.1} cy={1000}>
				<Sky stops={['#6f9cc4', '#a9c6db', '#f3d09a']} />
				<Sun x={860} y={760} r={70} t={f} />
				<Ridge y={860} amp={170} color="#7d8fa6" seed={3} line="#5d6b80" />
				<Ridge y={960} amp={110} color="#8e9a78" seed={9} />
				<Tree x={90} y={1010} s={0.9} seed={2} />
				<Tree x={1000} y={1000} s={0.8} seed={7} />
				<Ground y={990} top="#b99b6f" bottom="#8f7250" />
				<Tent x={170} y={1080} s={0.75} />
				<Tent x={930} y={1070} s={0.65} flip color="#7a5d40" />
				<Rock x={820} y={1210} w={90} h={60} seed={4} />
				<Grass x={330} y={1260} s={1.2} />
				<Grass x={760} y={1300} s={1} />
				<Bone x={260} y={1400} r={-15} />
				<Bone x={880} y={1450} r={20} s={0.8} />
				<Character
					x={540}
					y={1180}
					scale={1.05}
					pose={pose}
					lid={shrug > 0.5 ? 0.1 : blink(f, 0.3)}
					brow={shrug * 0.9}
					lookX={current >= 0 && shrug < 0.5 ? (icons[current].x - 540) / 330 : 0}
					lookY={shrug < 0.5 && current >= 0 ? -1 : 0}
					mouth={shrug > 0.5 ? 'o' : 'smile'}
					headTilt={shrug * -8}
				/>
			</Cam>
			<g opacity={iconsOut}>
				{icons.map((ic) => {
					const s = pop(f, ic.t);
					const c = pop(f, ic.t + 0.35, 8);
					return (
						<g key={ic.x} transform={`translate(${ic.x} ${420}) scale(${s})`}>
							{ic.el}
							<g transform="translate(0 0)">
								<Cross s={c * 1.1} />
							</g>
						</g>
					);
				})}
			</g>
			<Label x={540} y={300} text="İlk insanlar" at={tPeki + 0.2} size={120} color="#ffd23f" rotate={-3} />
			<Label x={540} y={440} text="günü nasıl" at={tPeki + 0.45} size={110} rotate={-3} />
			<Label x={540} y={570} text="geçirirdi?" at={tPeki + 0.7} size={120} color="#ffd23f" rotate={-3} />
		</Stage>
	);
};
