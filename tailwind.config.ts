import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // heading: ['var(--font-heading)'],
        // body: ['var(--font-body)'],
        sarala: ['var(--font-sarala)'],
      },
    },
  },
  plugins: [],
}
export default config 