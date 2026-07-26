import { Hero } from '../components/Hero'
import { HappyPath } from '../components/HappyPath'
import { Quickstart } from '../components/Quickstart'
import { Demos } from '../components/Demos'
import { Features } from '../components/Features'
import { Differentiation } from '../components/Differentiation'
import { ProductStills } from '../components/ProductStills'
import { ComingSoon } from '../components/ComingSoon'
import { usePageTitle } from '../lib/usePageTitle'

export function HomePage() {
  usePageTitle()
  return (
    <>
      <Hero />
      <HappyPath />
      <Quickstart />
      <Demos />
      <Features />
      <Differentiation />
      <ProductStills />
      <ComingSoon />
    </>
  )
}
