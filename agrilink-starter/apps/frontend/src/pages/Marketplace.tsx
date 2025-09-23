import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const demoFarms = [
  { id:'farm-01', name:'Chiang Mai Organic Farm', produce:'Longan', district:'Saraphi', rating:4.8 },
  { id:'farm-02', name:'Mae Rim Hydroponics', produce:'Lettuce', district:'Mae Rim', rating:4.5 }
]

export default function Marketplace(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Digital Farm Marketplace</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {demoFarms.map(f => (
          <Card key={f.id}>
            <CardHeader className="flex items-center justify-between">
              <div className="font-semibold">{f.name}</div>
              <span className="text-xs text-gray-500">{f.district}</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Main produce: <strong>{f.produce}</strong></p>
              <p className="text-sm text-gray-600 mt-1">Rating: {f.rating}★</p>
              <div className="mt-3 text-sm">
                <a className="text-brand-700 hover:underline" href={`/qr/${encodeURIComponent(f.id)}-LOT-001`}>View QR traceability</a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
