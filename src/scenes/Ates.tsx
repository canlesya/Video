import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S, blink, ease, lerpPose} from '../anim';
import {wordAt} from '../captions';
import {Character, POSES} from '../components/Character';
import {OUT} from '../components/palette';
import {Fire, Ground, Rock, Sky, Tree} from '../components/Scenery';
import {Badge, Cam, Stage, TimeChip} from '../components/UI';

const Eyes: React.FC<{x: number; y: number; o: number; f: number}> = ({x, y, o, f}) => {
	const b = (f + x) % 80 < 4 ? 0.15 : 1;
	return (
		<g opacity={o}>
			<ellipse cx={x - 22} cy={y} rx={12} ry={9 * b} fill="#f6e04a" />
			<ellipse cx={x + 22} cy={y} rx={12} ry={9 * b} fill="#f6e04a" />
			<ellipse cx={x - 22} cy={y} rx={4} ry={7 * b} fill="#1a1208" />
			<ellipse cx={x + 22} cy={y} rx={4} ry={7 * b} fill="#1a1208" />
		</g>
	);
};

const Bush: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		{[-110, -40, 40, 110].map((dx, i) => (
			<circle key={i} cx={dx} cy={-60 - (i % 2) * 40} r={85} fill="#1f2b2a" stroke={OUT} strokeWidth={5} />
		))}
	</g>
);

export const Ates: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const t = f / 30;
	const intensity = 0.06 + ease(f, [S(1.3), S(3.6)], [0, 0.94]);
	const blowing = t > 0.5 && t < 3.4;
	const warm = ease(f, [S(3.6), S(4.3)], [0, 1]);
	const puff = blowing ? 0.5 + 0.5 * Math.sin(f * 0.35) : 0;
	const pose = lerpPose(
		{...POSES.sit, lArm: [-10, 70], rArm: [30, 20]},
		{...POSES.sit, lArm: [40, 40], rArm: [70, 15]},
		warm,
	);
	const tSicak = wordAt('ates', 'sıcaklık');
	const tIsik = wordAt('ates', 'ışık');
	const tVahsi = wordAt('ates', 'vahşi');
	return (
		<Stage>
			<Cam dur={dur} from={1.12} to={1.22} cx={560} cy={1120}>
				<Sky stops={['#1c2438', '#3a4260', '#6e6a80']} />
				<Tree x={120} y={1010} s={1.1} color="#2d3d35" dark="#233128" seed={4} />
				<Tree x={980} y={990} s={1.0} color="#2d3d35" dark="#233128" seed={9} />
				<Ground y={980} top="#4f4236" bottom="#3a3028" />
				<Bush x={880} y={1040} s={0.9} />
				<Bush x={170} y={1030} s={0.75} />
				<Eyes x={870} y={950} o={1 - ease(f, [S(tVahsi), S(tVahsi + 1)], [0, 1])} f={f} />
				<Eyes x={180} y={960} o={1 - ease(f, [S(tVahsi + 0.3), S(tVahsi + 1.3)], [0, 1])} f={f + 30} />
				<Rock x={300} y={1210} w={130} h={90} seed={2} color="#7a7c82" />
				<Character
					x={300}
					y={1130}
					scale={0.9}
					pose={pose}
					lean={blowing ? 26 : 12}
					skin="mid"
					hair="dark"
					cheeks={blowing && puff > 0.4}
					mouth={blowing ? 'o' : 'smile'}
					lid={blowing ? 0.55 : blink(f, 0.3)}
					lookX={0.8}
					lookY={0.6}
				/>
				{blowing ? (
					<g opacity={puff} stroke="#e8eef5" strokeWidth={8} strokeLinecap="round" fill="none">
						<path d="M 470 880 q 60 30 120 110" />
						<path d="M 480 910 q 50 30 110 120" />
						<path d="M 455 930 q 40 40 90 120" />
					</g>
				) : null}
				<Fire x={700} y={1240} s={0.95} t={f} intensity={intensity} />
				{Array.from({length: 5}, (_, i) => {
					const life = ((f + i * 18) % 90) / 90;
					return (
						<circle
							key={i}
							cx={700 + Math.sin(life * 5 + i) * 40}
							cy={1100 - life * 700}
							r={30 + life * 60}
							fill="#9aa0aa"
							opacity={(1 - life) * 0.25 * (1 - intensity * 0.6)}
						/>
					);
				})}
			</Cam>
			<TimeChip time="06:30" label="Ateş" />
			<Badge x={540} y={330} text="Sıcaklık" at={tSicak} color="#ff8a4a" />
			<Badge x={540} y={470} text="Işık" at={tIsik} color="#ffd23f" />
			<Badge x={540} y={610} text="Koruma" at={tVahsi + 0.4} color="#7cc4ff" />
		</Stage>
	);
};
