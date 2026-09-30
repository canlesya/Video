export const OUT = '#2a1a10';
export const SW = 6; // standart kontur kalınlığı

export const SKIN = {
	light: {base: '#e9b78f', shade: '#d49a70'},
	mid: {base: '#c98d60', shade: '#b0764c'},
	dark: {base: '#8d5b3b', shade: '#74472c'},
};

export const HAIR = {
	brown: '#6e4020',
	auburn: '#7a4524',
	dark: '#2e1d14',
	light: '#8a5a30',
};

export const LEOPARD = {base: '#d9a646', spot: '#4f3318', shade: '#bf8a33'};
export const FUR = {base: '#5f4d3b', light: '#78634d', dark: '#46382a'};
export const KHAKI = {shirt: '#6f7a4a', vest: '#9c8f63', pants: '#5f6443', boot: '#6a4a2e'};

// Basit deterministik rastgele sayı üreteci (her render'da aynı sonuç)
export const rand = (seed: number) => {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
