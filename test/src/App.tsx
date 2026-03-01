import { Lumidot } from 'lumidot'

function App() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      <Lumidot testId="default" />
      <Lumidot testId="variant-amber" variant="amber" />
      <Lumidot testId="pattern-spiral" pattern="spiral" />
      <Lumidot testId="pattern-corners-only" pattern="corners-only" />
      <Lumidot testId="pattern-line-h-top" pattern="line-h-top" />
      <Lumidot testId="direction-rtl" direction="rtl" />
      <Lumidot testId="scale-2" scale={2} />
      <Lumidot testId="glow-0" glow={0} />
    </div>
  )
}

export default App
