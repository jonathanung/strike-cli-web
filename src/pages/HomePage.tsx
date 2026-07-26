import { Hero } from '../components/Hero'
import { HappyPath } from '../components/HappyPath'
import { Demos } from '../components/Demos'
import { Features } from '../components/Features'
import { Differentiation } from '../components/Differentiation'
import { ProductStills } from '../components/ProductStills'
import { ComingSoon } from '../components/ComingSoon'

export function HomePage() {
  return (
    <>
      <Hero />
      <HappyPath />
      <Demos />
      <Features />
      <Differentiation />
      <ProductStills />
      <ComingSoon />
    </>
  )
}
