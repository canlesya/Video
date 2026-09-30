import {Easing, interpolate, spring} from 'remotion';
import type {Pose} from './components/Character';
import {FPS} from './script';

export const ease = (f: number, input: [number, number], output: [number, number]) =>
	interpolate(f, input, output, {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});

export const lin = (f: number, input: number[], output: number[]) =>
	interpolate(f, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** saniye cinsinden `at` anında başlayan yaylı giriş (0..1) */
export const pop = (f: number, at: number, damping = 11) =>
	spring({frame: f - Math.round(at * FPS), fps: FPS, config: {damping, stiffness: 170, mass: 0.7}});

/** Doğal göz kırpma: temel kapak değerine ara ara kırpma ekler */
export const blink = (f: number, base = 0.35, offset = 0) => {
	const p = (f + offset) % 97;
	if (p < 3) return base + (1 - base) * (p / 3);
	if (p < 6) return 1 - (1 - base) * ((p - 3) / 3);
	return base;
};

/** konuşma ağız hareketi */
export const talk = (f: number, speed = 1) =>
	Math.max(0, Math.sin(f * 0.55 * speed) * 0.6 + Math.sin(f * 0.23 * speed + 1) * 0.4);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
	lArm: [lerp(a.lArm[0], b.lArm[0], t), lerp(a.lArm[1], b.lArm[1], t)],
	rArm: [lerp(a.rArm[0], b.rArm[0], t), lerp(a.rArm[1], b.rArm[1], t)],
	lLeg: [lerp(a.lLeg[0], b.lLeg[0], t), lerp(a.lLeg[1], b.lLeg[1], t)],
	rLeg: [lerp(a.rLeg[0], b.rLeg[0], t), lerp(a.rLeg[1], b.rLeg[1], t)],
	thigh: lerp(a.thigh ?? 195, b.thigh ?? 195, t),
});

/** saniyeyi kareye çevirir */
export const S = (s: number) => Math.round(s * FPS);
