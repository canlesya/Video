import React from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions} from './components/UI';
import {MUSIC_FILE, MUSIC_VOLUME, SEGMENTS, SceneId, VOICEOVER_FILE, sec} from './script';
import {Hook} from './scenes/Hook';
import {Sabah} from './scenes/Sabah';
import {Ates} from './scenes/Ates';
import {Toplama} from './scenes/Toplama';
import {Av} from './scenes/Av';
import {Bos} from './scenes/Bos';
import {Alet} from './scenes/Alet';
import {Gece} from './scenes/Gece';
import {Kapanis} from './scenes/Kapanis';

// Yazı tipini render başlamadan önce yükle
const fontHandle = delayRender('Yazı tipi yükleniyor');
const font = new FontFace('Luckiest', `url(${staticFile('LuckiestGuy-Regular.ttf')}) format('truetype')`);
font
	.load()
	.then(() => {
		document.fonts.add(font);
		continueRender(fontHandle);
	})
	.catch((err) => {
		console.error(err);
		continueRender(fontHandle);
	});

const SCENES: Record<SceneId, React.FC<{dur: number}>> = {
	hook: Hook,
	sabah: Sabah,
	ates: Ates,
	toplama: Toplama,
	av: Av,
	bos: Bos,
	alet: Alet,
	gece: Gece,
	kapanis: Kapanis,
};

const FADE = 8; // sahne geçişi (kare)

const Transition: React.FC<{first: boolean; children: React.ReactNode}> = ({first, children}) => {
	const f = useCurrentFrame();
	const o = first ? 1 : interpolate(f, [0, FADE], [0, 1], {extrapolateRight: 'clamp'});
	const s = first ? 1 : interpolate(f, [0, FADE + 6], [1.06, 1], {extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{opacity: o, transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => {
	const outro = SEGMENTS.find((s) => s.scene === 'kapanis');
	return (
		<AbsoluteFill style={{backgroundColor: '#140c08'}}>
			{SEGMENTS.map((seg, i) => {
				const from = sec(seg.start);
				const last = i === SEGMENTS.length - 1;
				const dur = sec(seg.end) - from + (last ? 0 : FADE);
				const Scene = SCENES[seg.scene];
				return (
					<Sequence key={seg.scene} from={from} durationInFrames={dur} name={seg.label}>
						<Transition first={i === 0}>
							<Scene dur={dur} />
						</Transition>
					</Sequence>
				);
			})}
			<Sequence durationInFrames={outro ? sec(outro.start) : undefined} name="Altyazı">
				<Captions />
			</Sequence>
			{VOICEOVER_FILE ? <Audio src={staticFile(VOICEOVER_FILE)} /> : null}
			{MUSIC_FILE ? <Audio src={staticFile(MUSIC_FILE)} volume={MUSIC_VOLUME} loop /> : null}
		</AbsoluteFill>
	);
};
