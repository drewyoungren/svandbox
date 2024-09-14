// place files you want to import through the `$lib` alias in this folder.

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
const norm = (x, y) => Math.sqrt(x * x + y * y);

/**
 *
 * @param {Array<number>} v
 * @returns {Array<number>}
 */
const normalize = (v) => {
	const n = norm(v[0], v[1]);
	return n == 0 ? v : [v[0] / n, v[1] / n];
};

/**
 *
 * @param {number[]} w
 * @param {number[]} v
 * @returns {number[]}
 */
const proj = (w, v) => {
	const [vx, vy] = v;
	const [wx, wy] = w;

	const c = (vx * wx + vy * wy) / (wx * wx + wy * wy);
	return [c * wx, c * wy];
};

/**
 * return the 1D velocities from a head-on elastic collision
 * @param {number} m mass 1
 * @param {number} M mass 2
 * @param {number} v velo 1
 * @param {number} w velo 2
 * @returns {number[]} final velos
 */
function headOnCollision(m, M, v, w) {
	return [(m * v - M * v + 2 * M * w) / (m + M), (2 * m * v - m * w + M * w) / (m + M)];
}

export { norm, normalize, proj, headOnCollision };
