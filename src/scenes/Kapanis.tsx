import React from 'react';
import {useCurrentFrame} from 'remotion';
import {blink, pop, talk} from '../anim';
import {wordAt} from '../captions';
import {Character} from '../components/Character';
import {OUT} from '../components/palette';
import {FONT, Label, Stage} from '../components/UI';

export const Kapanis: React.FC<{dur: number}> = () => {
	const f = useCurrentFrame();
	const tBir = wordAt('kapanis', 'bir');
	const tDay = wordAt('kapanis', 'dayanabilir');
	const tYorum = wordAt('kapanis', 'yorumlara');
	const cta = pop(f, tYorum, 9);
	const bounce = Math.abs(Math.sin(f * 0.25)) * 24;
	const speaking = f / 30 < tYorum + 1.2;
	return (
		<Stage>
			<rect x={0} y={0} width={1080} height={1920} fill="#f2a541" />
			<g transform={`translate(540 1000) rotate(${f * 0.4})`}>
				{Array.from({length: 16}, (_, i) => (
					<path key={i} d="M 0 0 L -130 -1400 L 130 -1400 Z" fill="#f7c35f" transform={`rotate(${i * 22.5})`} />
				))}
			</g>
			<circle cx={540} cy={1000} r={520} fill="#f7c35f" opacity={0.5} />
			<Character
				x={540}
				y={1760}
				scale={2.05}
				lean={Math.sin(f * 0.08) * 2}
				pose={{lArm: [-25, 150], rArm: [25, -150], lLeg: [-4, 2], rLeg: [4, -2]}}
				lid={blink(f, 0.2)}
				brow={f / 30 > tDay ? 0.9 : 0.3}
				lookX={0}
				lookY={0.1}
				mouth={speaking ? 'open' : 'grin'}
				talk={speaking ? talk(f) : 0}
				headTilt={Math.sin(f * 0.1) * 4}
			/>
			<Label x={540} y={250} text="Sence sen" at={0.1} size={110} color="#ffffff" rotate={-3} />
			<Label x={540} y={380} text="o çağda" at={0.45} size={110} color="#ffffff" rotate={-3} />
			<Label x={540} y={510} text="bir gün bile" at={tBir} size={110} color="#ffd23f" rotate={-3} />
			<Label x={540} y={650} text="dayanabilir" at={tDay} size={120} color="#ff5a3c" rotate={-3} />
			<Label x={540} y={780} text="miydin?" at={tDay + 0.35} size={120} color="#ff5a3c" rotate={-3} />
			{cta > 0.01 ? (
				<g transform={`translate(540 ${1500 + bounce * 0.3}) scale(${cta})`}>
					<rect x={-380} y={-80} width={760} height={160} rx={80} fill="rgba(0,0,0,0.35)" transform="translate(0 10)" />
					<rect x={-380} y={-80} width={760} height={160} rx={80} fill="#fdfaf2" stroke={OUT} strokeWidth={9} />
					<text x={-40} y={8} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT} fontSize={78} fill={OUT}>
						YORUMLARA YAZ
					</text>
					<g transform={`translate(290 ${bounce - 10})`}>
						<path d="M -16 -50 L 16 -50 L 16 0 L 40 0 L 0 50 L -40 0 L -16 0 Z" fill="#e8322b" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
					</g>
				</g>
			) : null}
		</Stage>
	);
};
