import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/parallaxBackground";
import { Particles } from "../components/Particles";
import { Astronaut } from "../components/Astronaut";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense } from "react";
import Loader from "../components/Loader";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  return (
    <section className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space">
      <Particles className="absolute inset-0 z-0" color="#6ee7b7" quantity={60} size={0.6} />
      <HeroText />
      <ParallaxBackground />
      {!isMobile && (
        <figure
          className="absolute inset-0"
          style={{ width: "100vw", height: "100vh" }}
        >
          <Canvas
            camera={{ position: [0, 1, 3] }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "low-power" }}
          >
            <Suspense fallback={<Loader />}>
              <Float>
                <Astronaut scale={0.3} position={[1.3, -1, 0]} />
              </Float>
              <Rig />
            </Suspense>
          </Canvas>
        </figure>
      )}
    </section>
  );
};

function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta
    );
  });
}

export default Hero;
