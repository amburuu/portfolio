'use client'

import dynamic from 'next/dynamic'

const ChaosScene = dynamic(() => import('./ChaosScene'), { ssr: false })

export default function ChaosSceneWrapper() {
  return <ChaosScene />
}