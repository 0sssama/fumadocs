// @ts-nocheck
'use client'

import {
  GLSLX_NAME_U_RESOLUTION,
  GLSLX_NAME_U_TIME,
  GLSLX_SOURCE_MAIN
} from '@/shaders/rain.min.js'
import Phenomenon from 'phenomenon'
import { useEffect, useRef, type CanvasHTMLAttributes } from 'react'

const vertex = `
attribute vec3 aPosition;void main(){gl_Position=vec4(aPosition,1.0);}
`

export function Rain(props: CanvasHTMLAttributes<HTMLCanvasElement>) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const contextType = canvas.getContext('webgl2')
      ? 'webgl2'
      : canvas.getContext('webgl')
      ? 'webgl'
      : 'experimental-webgl'

    // Create a renderer
    const phenomenon = new Phenomenon({
      canvas,
      contextType,
      settings: {
        alpha: true,
        position: { x: 0, y: 0, z: 1 },
        shouldRender: true
      }
    })

    phenomenon.add('', {
      mode: 4,
      vertex,
      geometry: {
        vertices: [
          { x: -100, y: 100, z: 0 },
          { x: -100, y: -100, z: 0 },
          { x: 100, y: 100, z: 0 },
          { x: 100, y: -100, z: 0 },
          { x: -100, y: -100, z: 0 },
          { x: 100, y: 100, z: 0 }
        ]
      },
      fragment: GLSLX_SOURCE_MAIN,
      uniforms: {
        [GLSLX_NAME_U_RESOLUTION]: {
          type: 'vec2',
          value: [
            canvas.width * window.devicePixelRatio,
            canvas.height * window.devicePixelRatio
          ]
        },
        [GLSLX_NAME_U_TIME]: {
          type: 'float',
          value: 0.0
        }
      },
      onRender: ({ uniforms }) => {
        uniforms[GLSLX_NAME_U_TIME].value += 0.01
      }
    })

    return () => {
      phenomenon.destroy()
    }
  }, [])

  return <canvas width={1000} height={1000} ref={ref} {...props} />
}
