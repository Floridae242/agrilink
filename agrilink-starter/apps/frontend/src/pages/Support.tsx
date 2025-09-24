import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Upload, Download, FileText, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface QAStats {
  totalInspections: number
  avgDefectRate: number
  avgSizeGrade: number
  tempExcursions: number
  certificationRate: number
  avgBrix: number
}

interface InspectionData {
  id: string
  farmId: string
  lotId: string
  defectRate: number
  sizeGrade: number
  brix: number
  tempExcursions: number
  inspectedAt: string
  farmName?: string
  lotName?: string
}

interface Certificate {
  id: string
  farmId: string
  lotId: string
  type: string
  issuedAt: string
  expiresAt: string
  filePath?: string
  farmName?: string
  lotName?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function Support() {
  const [qaStats, setQaStats] = useState<QAStats | null>(null)
  const [inspections, setInspections] = useState<InspectionData[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadLotId, setUploadLotId] = useState('')
  const [uploadType, setUploadType] = useState('ORGANIC')

  // Simulated chart data
  const defectTrendData = [
    { month: 'Jan', defectRate: 2.1 },
    { month: 'Feb', defectRate: 1.8 },
    { month: 'Mar', defectRate: 2.3 },
    { month: 'Apr', defectRate: 1.5 },
    { month: 'May', defectRate: 1.2 },
    { month: 'Jun', defectRate: 1.7 },
  ]

  const sizeGradeData = [
    { grade: 'Premium', count: 450 },
    { grade: 'Grade A', count: 280 },
    { grade: 'Grade B', count: 120 },
    { grade: 'Grade C', count: 50 },
  ]

  const brixDistribution = [
    { range: '16-17', count: 15 },
    { range: '18-19', count: 35 },
    { range: '20-21', count: 28 },
    { range: '22+', count: 22 },
  ]

  useEffect(() => {
    fetchQAData()
  }, [])

  const fetchQAData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Fetch QA statistics
      const statsResponse = await fetch('/api/qa/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        setQaStats(stats)
      }

      // Fetch recent inspections
      const inspectionsResponse = await fetch('/api/qa/inspections', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (inspectionsResponse.ok) {
        const inspectionsData = await inspectionsResponse.json()
        setInspections(inspectionsData)
      }

      // Fetch certificates
      const certificatesResponse = await fetch('/api/qa/certificates', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (certificatesResponse.ok) {
        const certificatesData = await certificatesResponse.json()
        setCertificates(certificatesData)
      }
    } catch (error) {
      console.error('Error fetching QA data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile || !uploadLotId) return

    const formData = new FormData()
    formData.append('certificate', selectedFile)
    formData.append('lotId', uploadLotId)
    formData.append('type', uploadType)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/qa/certificates', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setSelectedFile(null)
        setUploadLotId('')
        fetchQAData() // Refresh data
        alert('Certificate uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading certificate:', error)
      alert('Failed to upload certificate')
    }
  }

  const downloadCertificate = (certificate: Certificate) => {
    if (certificate.filePath) {
      window.open(`/uploads/${certificate.filePath}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading QA Analytics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8">Quality Analytics & Certificates</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inspections</p>
                <p className="text-2xl font-bold">{qaStats?.totalInspections || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Defect Rate</p>
                <p className="text-2xl font-bold">{qaStats?.avgDefectRate?.toFixed(1) || 0}%</p>
              </div>
              {(qaStats?.avgDefectRate || 0) < 2 ? 
                <CheckCircle className="h-8 w-8 text-green-500" /> :
                <AlertCircle className="h-8 w-8 text-red-500" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Size Grade</p>
                <p className="text-2xl font-bold">{qaStats?.avgSizeGrade?.toFixed(1) || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temp Excursions</p>
                <p className="text-2xl font-bold">{qaStats?.tempExcursions || 0}</p>
              </div>
              {(qaStats?.tempExcursions || 0) > 5 ? 
                <TrendingUp className="h-8 w-8 text-red-500" /> :
                <TrendingDown className="h-8 w-8 text-green-500" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certification Rate</p>
                <p className="text-2xl font-bold">{qaStats?.certificationRate?.toFixed(1) || 0}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Brix</p>
                <p className="text-2xl font-bold">{qaStats?.avgBrix?.toFixed(1) || 0}°</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Defect Rate Trend</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={defectTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="defectRate" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Size Grade Distribution</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sizeGradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Brix Distribution</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={brixDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {brixDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Certificate Upload */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Upload Certificate</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Lot ID</label>
              <input
                type="text"
                value={uploadLotId}
                onChange={(e) => setUploadLotId(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter lot ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Certificate Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="ORGANIC">Organic</option>
                <option value="GLOBAL_GAP">Global GAP</option>
                <option value="QUALITY_ASSURANCE">Quality Assurance</option>
                <option value="EXPORT">Export Certificate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Certificate File</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <Button 
              onClick={handleFileUpload}
              disabled={!selectedFile || !uploadLotId}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Certificate
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inspections */}
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Inspections</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Farm</th>
                  <th className="text-left p-2">Lot</th>
                  <th className="text-left p-2">Defect Rate</th>
                  <th className="text-left p-2">Size Grade</th>
                  <th className="text-left p-2">Brix</th>
                  <th className="text-left p-2">Temp Excursions</th>
                </tr>
              </thead>
              <tbody>
                {inspections.slice(0, 10).map((inspection) => (
                  <tr key={inspection.id} className="border-b">
                    <td className="p-2">{new Date(inspection.inspectedAt).toLocaleDateString()}</td>
                    <td className="p-2">{inspection.farmName || inspection.farmId}</td>
                    <td className="p-2">{inspection.lotName || inspection.lotId}</td>
                    <td className="p-2">
                      <span className={`${inspection.defectRate > 2 ? 'text-red-600' : 'text-green-600'}`}>
                        {inspection.defectRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-2">{inspection.sizeGrade.toFixed(1)}</td>
                    <td className="p-2">{inspection.brix.toFixed(1)}°</td>
                    <td className="p-2">
                      <span className={`${inspection.tempExcursions > 1 ? 'text-red-600' : 'text-green-600'}`}>
                        {inspection.tempExcursions}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Certificates</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Farm</th>
                  <th className="text-left p-2">Lot</th>
                  <th className="text-left p-2">Issued</th>
                  <th className="text-left p-2">Expires</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="border-b">
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {certificate.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-2">{certificate.farmName || certificate.farmId}</td>
                    <td className="p-2">{certificate.lotName || certificate.lotId}</td>
                    <td className="p-2">{new Date(certificate.issuedAt).toLocaleDateString()}</td>
                    <td className="p-2">{new Date(certificate.expiresAt).toLocaleDateString()}</td>
                    <td className="p-2">
                      {certificate.filePath && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadCertificate(certificate)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cultivation Guidance */}
      <Card className="mt-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Cultivation Guidance</h3>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Quality Standards</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Harvest longan at Brix 18+ for premium buyers</li>
                <li>Maintain defect rate below 2% for Grade A certification</li>
                <li>Target size grade 4.0+ for export markets</li>
                <li>Ensure uniform ripeness across batch</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cold Chain Management</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Pre-cool within 4 hours of harvest to ≤ 5°C</li>
                <li>Maintain temperature during transport</li>
                <li>Monitor for temperature excursions</li>
                <li>Document cold chain compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
