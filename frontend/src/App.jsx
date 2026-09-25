import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import Hero from './sections/Hero'
import About from './sections/About'
import Stack from './sections/Stack'
import FeaturedProjects from './sections/FeaturedProjects'
import OtherProjects from './sections/OtherProjects'
import Hackathons from './sections/Hackathons'
import Journey from './sections/Journey'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

/**
 * Main application shell.
 * Assembles the visual experience in scroll order.
 */
export default function App() {
  return (
    <>
      <CustomCursor />
      <Navigation />

      <main>
        <Hero />
        <About />
        <Stack />
        <FeaturedProjects />
        <OtherProjects />
        <Hackathons />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
