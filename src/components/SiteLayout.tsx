import { Outlet } from 'react-router-dom'
import { BackgroundEffects } from './BackgroundEffects'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToHash } from './ScrollToHash'

export function SiteLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <ScrollToHash />
      <BackgroundEffects />
      <Header />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
