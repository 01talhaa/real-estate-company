"use client"

import dynamic from "next/dynamic"

const Plasma = dynamic(() => import("@/components/plasma"), {
  ssr: false,
})

export default function PlasmaWrapper({
  color = "#064E3B",
  speed = 0.8,
  direction = "forward",
  scale = 1.5,
  opacity = 0.10,
  mouseInteractive = true,
}: {
  color?: string
  speed?: number
  direction?: 'forward' | 'reverse'
  scale?: number
  opacity?: number
  mouseInteractive?: boolean
}) {
  return (
    <Plasma 
      color={color}
      speed={speed} 
      direction={direction}
      scale={scale}
      opacity={opacity}
      mouseInteractive={mouseInteractive}
    />
  )
}
