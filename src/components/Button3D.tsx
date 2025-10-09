'use client'

import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { parse, formatHex } from 'culori'
import * as THREE from 'three'

function ButtonModel() {
  const { scene } = useGLTF('/3d/button.glb') as any
  const modelRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!modelRef.current) return

    // Get Tailwind OKLCH color values
    const styles = getComputedStyle(document.documentElement)
    const primaryOklch = styles.getPropertyValue('--primary').trim()
    const foregroundOklch = styles.getPropertyValue('--primary-foreground').trim()

    // Convert OKLCH to hex
    const primaryHex = formatHex(parse(`oklch(${primaryOklch})`)) || '#C44B25'
    const foregroundHex = formatHex(parse(`oklch(${foregroundOklch})`)) || '#FFF'

    // Traverse and apply colors
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = (child.material as THREE.MeshStandardMaterial).clone()
        child.material = mat
        mat.needsUpdate = true

        if (child.name.toLowerCase().includes('arrow')) {
          mat.color.set(foregroundHex)
          mat.emissive.set(0x000000)
        } else if (child.name.toLowerCase().includes('ellipse')) {
          mat.color.set(primaryHex)
          mat.emissive.set(0x000000)
        }
      }
    })
  }, [])

  return (
    <group ref={modelRef} scale={2}>
      <primitive object={scene} />
    </group>
  )
}

export default function Button3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} intensity={1} castShadow />
        <ButtonModel />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

// Preload the GLB
useGLTF.preload('/3d/button.glb')
