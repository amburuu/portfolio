'use client'

import dynamic from 'next/dynamic'

const AstralMeshScene = dynamic(() => import('./AstralMeshScene'), { ssr: false })

export default function AstralMeshSceneWrapper() {
  return <AstralMeshScene />
}