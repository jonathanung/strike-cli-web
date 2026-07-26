import { BackgroundEffects } from './components/BackgroundEffects'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HappyPath } from './components/HappyPath'
import { Demos } from './components/Demos'
import { Features } from './components/Features'
import { ComingSoon } from './components/ComingSoon'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <BackgroundEffects />
      <Header />
      <main className="relative flex-1">
        <Hero />
        <HappyPath />
        <Demos />
        <Features />
        <ComingSoon />
      </main>
      <Footer />
    </div>
  )
}
