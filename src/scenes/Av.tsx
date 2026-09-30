import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S, blink, ease, lerp, lin, talk} from '../anim';
import {wordAt} from '../captions';
import {Character, Pose} from '../components/Character';
import {OUT} from '../components/palette';
import {Acacia, Clouds, Deer, Grass, Ground, Ridge, Sky, Spear} from '../components/Scenery';
import {Cam, Label, Stage, TimeChip} from '../components/UI';

const runPose = (ph: number, k: number): Pose => {
	const s = Math.sin(ph) * k;
	return {
		lArm: [-20 - s * 30, 60],
		rArm: [150, 30],
		lLeg: [s * 38, 20 + Math.max(0, -Math.sin(ph)) * 60 * k],
		rLeg: [-s * 38, -20 - Math.max(0, Math.sin(ph)) * 60 * k],
	};
};

const standPose: Pose = {lArm: [-15, 10], rArm: [25, -40], lLeg: [-4, 2], rLeg: [4, -2]};

const mix = (a: Pose, b: Pose, t: number): Pose => {
	const m = (x: [number, number], y: [number, number]): [number, number] => [lerp(x[0], y[0], t), lerp(x[1], y[1], t)];
	return {lArm: m(a.lArm, b.lArm), rArm: m(a.rArm, b.rArm), lLeg: m(a.lLeg, b.lLeg), rLeg: m(a.rLeg, b.rLeg)};
};

export const Av: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const tAma = wordAt('av', 'ama');
	const tBos = wordAt('av', 'boş');
	const stop = ease(f, [S(tAma - 0.9), S(tAma - 0.2)], [0, 1]);
	const ph = f * 0.5;
	const deerX = lin(f, [S(0.2), S(3.6)], [-300, 1450]);
	const h1x = lerp(-250, 690, ease(f, [S(0.3), S(tAma - 0.2)], [0, 1]));
	const h2x = lerp(-520, 360, ease(f, [S(0.5), S(tAma - 0.1)], [0, 1]));
	const bob = (p: number) => -Math.abs(Math.sin(p)) * 16 * (1 - stop);
	const sad = f > S(tAma);
	const spearRun = () => <Spear angle={-8} />;
	const spearStand = () => <Spear angle={-88} len={440} grip={0.6} />;
	const drop = (f % 40) / 40;
	return (
		<Stage>
			<Cam dur={dur} from={1.0} to={1.06} cy={1000}>
				<Sky stops={['#6f7f95', '#9aa8b8', '#c9cfd4']} />
				<Clouds t={f} y={130} color="#8594a8" line="#6d7b8f" rows={3} speed={0.8} />
				<Ridge y={930} amp={90} color="#8792a0" seed={31} line="#6c7684" peaks={4} />
				<Ground y={960} top="#c9b184" bottom="#a38a5c" />
				<Acacia x={860} y={990} s={1.05} />
				<Acacia x={180} y={960} s={0.6} />
				<Grass x={120} y={1320} s={1.3} color="#8a8a4a" />
				<Grass x={960} y={1290} s={1.1} color="#8a8a4a" />
				<Grass x={560} y={1400} s={1} color="#8a8a4a" />
				{deerX < 1400 ? <Deer x={deerX} y={1080} s={0.9} t={f} /> : null}
				{[
					{x: h2x, p: ph + 1.5, skin: 'dark' as const, hair: 'dark' as const, curly: true, sc: 0.78, y: 1070},
					{x: h1x, p: ph, skin: 'light' as const, hair: 'brown' as const, curly: false, sc: 0.85, y: 1110},
				].map((h, i) => (
					<Character
						key={i}
						x={h.x}
						y={h.y + bob(h.p)}
						scale={h.sc}
						skin={h.skin}
						hair={h.hair}
						curly={h.curly}
						beard={!h.curly}
						pose={mix(runPose(h.p, 1), standPose, stop)}
						lean={lerp(14, 0, stop)}
						rightItem={stop > 0.5 ? spearStand : spearRun}
						lid={sad ? 0.5 : blink(f, 0.1, i * 30)}
						lookX={sad ? 0.9 : 1}
						brow={sad ? 0.9 : -0.4}
						mouth={sad ? 'frown' : 'open'}
						talk={sad ? 0 : 0.4 + talk(f) * 0.4}
					/>
				))}
				{sad ? (
					<path
						d={`M ${h1x + 60} ${760 + drop * 60} q 12 18 0 26 q -12 -8 0 -26 z`}
						fill="#8fd0ff"
						stroke={OUT}
						strokeWidth={4}
						opacity={1 - drop}
					/>
				) : null}
			</Cam>
			<TimeChip time="11:00" label="Av" />
			<Label x={540} y={430} text="Eli boş!" at={tBos} size={130} color="#ff6a4a" rotate={-5} />
		</Stage>
	);
};
