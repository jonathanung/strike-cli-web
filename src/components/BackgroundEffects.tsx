import { useReducedMotion } from 'framer-motion'

/** Stable organic curves — fixed paths for SSR/hydration safety */
const CURVE_PATHS = [
  {
    d: 'M-40 180 C 120 40, 280 320, 480 160 S 780 40, 980 220 S 1180 380, 1280 240',
    strokeWidth: 2.5,
    opacity: 0.28,
    dash: '2 12',
    duration: '48s',
  },
  {
    d: 'M 80 -20 C 200 200, 360 80, 520 280 S 780 420, 960 200 S 1140 60, 1240 300',
    strokeWidth: 3,
    opacity: 0.22,
    dash: '1.5 14',
    duration: '56s',
  },
  {
    d: 'M-20 520 C 160 380, 300 620, 500 480 S 740 300, 900 540 S 1100 700, 1260 460',
    strokeWidth: 2.25,
    opacity: 0.2,
    dash: '2 11',
    duration: '62s',
  },
  {
    d: 'M 200 820 C 340 640, 480 760, 640 580 S 880 420, 1040 640 S 1180 780, 1300 560',
    strokeWidth: 3.25,
    opacity: 0.18,
    dash: '2 13',
    duration: '52s',
  },
  {
    d: 'M-60 360 C 100 520, 260 240, 420 400 S 680 560, 840 320 S 1060 180, 1220 400',
    strokeWidth: 2,
    opacity: 0.25,
    dash: '1 12',
    duration: '70s',
  },
  {
    d: 'M 40 700 C 220 560, 400 780, 580 620 S 820 480, 1000 700 S 1160 860, 1280 680',
    strokeWidth: 2.75,
    opacity: 0.16,
    dash: '2 15',
    duration: '58s',
  },
] as const

export function BackgroundEffects() {
  const reduceMotion = useReducedMotion()
  const orbClass = reduceMotion ? '' : 'animate-orb'
  const curveClass = reduceMotion ? '' : 'animate-curve-dash'

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Soft top radial — restrained, cockpit not lavender SaaS wash */}
      <div
        className="absolute inset-x-0 top-0 h-[55vh]"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% -10%, color-mix(in srgb, var(--color-accent-glow) 14%, transparent), transparent 70%)',
        }}
      />

      {/* Subtle grid overlay */}
      <div className="bg-grid absolute inset-0 opacity-[0.22]" />

      {/* Floating gradient orbs — lower opacity for solid TUI feel */}
      <div
        className={`absolute -left-24 top-[-10%] size-[36rem] rounded-full blur-3xl ${orbClass}`}
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent-glow) 28%, transparent) 0%, transparent 70%)',
          opacity: 0.32,
          ['--orb-duration' as string]: '24s',
        }}
      />
      <div
        className={`absolute -right-32 top-[22%] size-[28rem] rounded-full blur-3xl ${orbClass}`}
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-sky) 18%, transparent) 0%, transparent 70%)',
          opacity: 0.22,
          ['--orb-duration' as string]: '28s',
          animationDelay: reduceMotion ? undefined : '-8s',
        }}
      />
      <div
        className={`absolute bottom-[-8%] left-[20%] size-[32rem] rounded-full blur-3xl ${orbClass}`}
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, transparent 70%)',
          opacity: 0.2,
          ['--orb-duration' as string]: '32s',
          animationDelay: reduceMotion ? undefined : '-14s',
        }}
      />

      {/* Light dotted curved constellation lines */}
      <svg
        className="absolute inset-0 h-full w-full text-accent"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {CURVE_PATHS.map((curve, i) => (
          <path
            key={i}
            d={curve.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={curve.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={curve.dash}
            opacity={curve.opacity}
            className={curveClass}
            style={
              reduceMotion
                ? undefined
                : {
                    ['--curve-duration' as string]: curve.duration,
                    animationDelay: `${-i * 7}s`,
                  }
            }
          />
        ))}
      </svg>

      {/* Soft bottom vignette for depth */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh]"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--color-bg) 90%, transparent), transparent)',
        }}
      />
    </div>
  )
}
