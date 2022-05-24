import { Suspense, useRef } from "react"
import { Texture, TextureLoader } from "three"
import { Canvas, useLoader, extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import waterImg from "../images/about_picture.jpg"

const WaveShaderMaterial = shaderMaterial(
  { map: new Texture(), repeats: 1 },
  `
  varying vec2 vUv;

  void main()	{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
  `,
  `
  varying vec2 vUv;
  uniform float repeats;
  uniform sampler2D map;

  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main(){
    vec2 uv = vUv;

    uv *= repeats;
    uv = fract(uv);

    vec3 color = vec3(
      texture2D(map, uv).r,
      texture2D(map, uv + vec2(0.01,0.01)).g,
      texture2D(map, uv - vec2(0.01,0.01)).b
    );

    gl_FragColor = vec4(color,1.0);

    #include <tonemapping_fragment>
    #include <encodings_fragment>
  }`
)

extend({ WaveShaderMaterial })

const Wave = ({ waveImage, freq }) => {
  const ref = useRef()
  // useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime() * freq))

  const [image] = useLoader(TextureLoader, [waveImage])

  return (
    <mesh>
      <planeBufferGeometry args={[24, 16, 32, 32]} />
      <waveShaderMaterial ref={ref} map={image} freq={freq} />
    </mesh>
  )
}

const Scene = ({ thumbnail, noiseFreq }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <Wave waveImage={thumbnail} freq={noiseFreq} />
      </Suspense>
    </Canvas>
  )
}

export default function App() {
  return (
    <div className="mt-20">
      <div className="w-[100vw]">
        <Scene thumbnail={waterImg} noiseFreq={1.2} />
      </div>
    </div>
  )
}
