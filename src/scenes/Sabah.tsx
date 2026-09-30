import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S, blink, ease, lerp, lerpPose} from '../anim';
import {Character, POSES, Pose} from '../components/Character';
import {OUT, rand} from '../components/palette';
import {FurRug, Ridge, Sky, Sun, Tent} from '../components/Scenery';
import {Cam, Stage, TimeChip, Zzz} from '../components/UI';

const LYING: Pose = {lArm: [-8, 0], rArm: [8, 0], lLeg: [-3, 0], rLeg: [3, 0]};

export const Sabah: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const wake = ease(f, [S(2.4), S(3.4)], [0, 1]); // doğrulma
	const stretch = ease(f, [S(3.5), S(4.3)], [0, 1]) * (1 - ease(f, [S(5.3), S(6)], [0, 1]) * 0.6);
	const sunY = lerp(980, 720, ease(f, [0, dur], [0, 1]));
	const pose = lerpPose(lerpPose(LYING, POSES.sit, wake), {...POSES.sit, lArm: POSES.stretch.lArm, rArm: POSES.stretch.rArm}, stretch);
	const sleeping = wake < 0.3;
	const yawning = f > S(3.5) && f < S(5);
	const cave =
		'M -200 -200 L 1280 -200 L 1280 2200 L -200 2200 Z M 150 1080 Q 130 420 540 330 Q 950 420 930 1080 Z';
	return (
		<Stage>
			<Cam dur={dur} from={1.0} to={1.07} cy={1100}>
				<Sky stops={['#34507a', '#9a8fb0', '#f7b267', '#f79d65']} />
				<Sun x={560} y={sunY} r={70} t={f} />
				<Ridge y={960} amp={150} color="#6c6a8a" seed={5} line="#4d4a66" />
				<Ridge y={1030} amp={80} color="#7e7a6a" seed={12} />
				<Tent x={800} y={1070} s={0.45} color="#7a5d40" />
				<path d="M 0 1040 L 1080 1040 L 1080 1100 L 0 1100 Z" fill="#8a7658" />
				{/* mağara duvarları */}
				<path d={cave} fill="#4a372b" fillRule="evenodd" stroke={OUT} strokeWidth={8} />
				{Array.from({length: 18}, (_, i) => (
					<path
						key={i}
						d={`M ${rand(i) * 1080} ${rand(i + 7) * 1000} q ${30 + rand(i + 2) * 60} ${-20 + rand(i + 3) * 40} ${80 + rand(i + 4) * 60} 0`}
						stroke="#5d4637"
						strokeWidth={10}
						fill="none"
						strokeLinecap="round"
						opacity={rand(i) * 1080 > 150 && rand(i) * 1080 < 930 && rand(i + 7) * 1000 > 330 ? 0 : 1}
					/>
				))}
				<path d="M 150 1080 Q 130 420 540 330 Q 950 420 930 1080" stroke="#6b5444" strokeWidth={22} fill="none" />
				{/* zemin */}
				<path d="M -200 1060 Q 540 1020 1280 1060 L 1280 2200 L -200 2200 Z" fill="#6b5240" stroke={OUT} strokeWidth={6} />
				<ellipse cx={540} cy={1250} rx={520} ry={200} fill="#ffd89a" opacity={0.12 + 0.12 * ease(f, [0, dur], [0, 1])} />
				<FurRug x={260} y={1160} w={170} h={45} color="#8a6c4c" />
				<Character
					x={250}
					y={1150}
					scale={0.45}
					rotate={-90}
					pose={LYING}
					outfit="fur"
					female
					hair="auburn"
					lid={1}
					mouth="flat"
				/>
				<FurRug x={560} y={1330} w={340} h={85} />
				<Character
					x={lerp(640, 540, wake)}
					y={lerp(1300, 1190, wake)}
					scale={0.92}
					rotate={lerp(-90, 0, wake)}
					pose={pose}
					lid={sleeping ? 1 : yawning ? 0.85 : blink(f, lerp(0.7, 0.35, stretch))}
					mouth={yawning ? 'open' : sleeping ? 'o' : 'smile'}
					talk={yawning ? 0.9 : 0}
					headTilt={yawning ? -10 : 0}
					brow={yawning ? 0.5 : 0}
				/>
				{sleeping ? <Zzz x={380} y={1180} t={f} /> : null}
				<Zzz x={120} y={1060} t={f + 20} />
			</Cam>
			<TimeChip time="06:00" label="Uyanış" />
		</Stage>
	);
};
