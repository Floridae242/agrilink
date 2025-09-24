import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '../components/ui/card'

export default function QRPublic(){
  const { lotId } = useParams()
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Public Traceability</h2>
      <Card>
        <CardHeader className="font-semibold">Lot {lotId}</CardHeader>
        <CardContent className="text-sm space-y-2">
          <div><strong>Farm:</strong> Chiang Mai Organic Farm (Farmer Somchai)</div>
          <div><strong>Origin:</strong> Saraphi, Chiang Mai</div>
          <div><strong>Events:</strong></div>
          <ul className="list-disc pl-5">
            <li>2025-09-22 07:00 — Harvested</li>
            <li>2025-09-22 09:30 — Pre-cooled to 4.5°C</li>
            <li>2025-09-23 10:00 — In Transit (Temp 4.1°C)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
