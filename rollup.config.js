import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

export default {
	input: 'src/svelteSegmentedInput.svelte',
	output: [
		{ file: pkg.module, format: 'es' },
		{ file: pkg.main, format: 'umd', name: 'svelteSegmentedInput' },
	],
	plugins: [
		svelte({
			compilerOptions: {
				css: true,
			},
			emitCss: false,
		}),
		resolve(),
		terser(),
	],
}
