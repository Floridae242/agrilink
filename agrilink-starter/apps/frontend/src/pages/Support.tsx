import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function Support(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Farm Support & QA</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="font-semibold">Quality Analytics (demo)</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">Visualize defect rate, size grading, and temperature excursions over time.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="font-semibold">Cultivation Guidance</CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Harvest longan at Brix 18+ for premium buyers.</li>
              <li>Pre-cool within 4 hours of harvest to ≤ 5°C.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
