import { Suspense, useEffect, useRef } from "react"
import { Texture, TextureLoader } from "three"
import { Canvas, useLoader, extend, useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import { fragmentShader } from "./fragment.glsl"
import { vertexShader } from "./vertex.glsl"
import waterImg from "../images/about_picture.jpg"
import productImg from "../images/firstview_picture_4.jpg"
import { gsap } from "gsap"

const WaveShaderMaterial = shaderMaterial({ uTexture: new Texture(), repeats: 1, wireframe: false, uTime: 0, noiseAmp: 0.045 }, vertexShader, fragmentShader)

extend({ WaveShaderMaterial })

const Wave = ({ waveImage, freq }) => {
  const ref = useRef()
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime() * freq))

  const [image] = useLoader(TextureLoader, [waveImage])

  // onload water animation
  useEffect(() => {
    gsap.to(ref.current, {
      duration: 4,
      delay: 1,
      noiseAmp: 0.002,
      ease: "power.inOut",
    })
  }, [])

  const handlePointerOver = () => {
    gsap.to(ref.current, {
      duration: 1.5,
      noiseAmp: 0.03,
      ease: "power.inOut",
    })
  }

  const handlePointerOut = () => {
    gsap.to(ref.current, {
      duration: 2,
      noiseAmp: 0.005,
      ease: "power.inOut",
    })
  }

  return (
    <mesh onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <planeGeometry args={[3, 2, 64, 64]} />
      <waveShaderMaterial ref={ref} uTexture={image} freq={freq} />
    </mesh>
  )
}

const Scene = ({ thumbnail, noiseFreq }) => {
  return (
    <Canvas camera={{ position: [0, 0, 0.3] }}>
      <Suspense fallback={null}>
        <Wave waveImage={thumbnail} freq={noiseFreq} />
      </Suspense>
    </Canvas>
  )
}

export default function App() {
  const imagesArr = [waterImg, productImg]
  return (
    <section className="w-[90vw] mx-auto mt-[10vh]">
      {imagesArr.map((image) => (
        <div className="mb-10 h-[30vh]">
          <Scene thumbnail={image} noiseFreq={1.2} />
        </div>
      ))}
    </section>
  )
}
