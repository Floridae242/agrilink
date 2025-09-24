import React from 'react'
import { KpiCard, DataTable, StatusBadge } from '../data/DataComponents'
import { LotSummary } from '../../schemas/lot'

interface FarmerDashboardProps {
  user: {
    name: string
    email: string
    farmName?: string
  }
  stats: {
    totalLots: number
    activeLots: number
    soldLots: number
    totalRevenue: number
    avgGrade: string
    pendingBids: number
  }
  recentLots: LotSummary[]
  onCreateLot: () => void
  onViewLot: (lotId: string) => void
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  user,
  stats,
  recentLots,
  onCreateLot,
  onViewLot
}) => {
  const lotColumns = [
    {
      key: 'publicId' as keyof LotSummary,
      label: 'Lot ID',
      sortable: true,
      width: '120px'
    },
    {
      key: 'crop' as keyof LotSummary,
      label: 'Crop',
      sortable: true
    },
    {
      key: 'variety' as keyof LotSummary,
      label: 'Variety',
      sortable: true
    },
    {
      key: 'quantity' as keyof LotSummary,
      label: 'Quantity',
      sortable: true,
      render: (value: number) => `${value.toLocaleString()} kg`
    },
    {
      key: 'grade' as keyof LotSummary,
      label: 'Grade',
      sortable: true,
      render: (value: string) => (
        <StatusBadge 
          status={value} 
          variant={value === 'A' ? 'success' : value === 'B' ? 'info' : 'warning'} 
        />
      )
    },
    {
      key: 'status' as keyof LotSummary,
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        const variant = value === 'PUBLISHED' ? 'info' : 
                      value === 'BIDDING' ? 'warning' : 
                      value === 'SOLD' ? 'success' : 'default'
        return <StatusBadge status={value} variant={variant} />
      }
    },
    {
      key: 'bidsCount' as keyof LotSummary,
      label: 'Bids',
      sortable: true
    },
    {
      key: 'highestBid' as keyof LotSummary,
      label: 'Highest Bid',
      sortable: true,
      render: (value: number | undefined) => 
        value ? `₿${value.toLocaleString()}` : '-'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          {user.farmName ? `${user.farmName} Farm` : 'Manage your farm operations'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Lots"
          value={stats.totalLots}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="blue"
        />
        
        <KpiCard
          title="Active Lots"
          value={stats.activeLots}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          color="green"
        />
        
        <KpiCard
          title="Sold Lots"
          value={stats.soldLots}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="purple"
        />
        
        <KpiCard
          title="Total Revenue"
          value={`₿${stats.totalRevenue.toLocaleString()}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="green"
        />
        
        <KpiCard
          title="Avg Grade"
          value={stats.avgGrade}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          color="yellow"
        />
        
        <KpiCard
          title="Pending Bids"
          value={stats.pendingBids}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onCreateLot}
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Create New Lot</p>
              <p className="text-xs text-gray-500">Add new produce to marketplace</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
              <p className="text-xs text-gray-500">Track farm performance</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Support</p>
              <p className="text-xs text-gray-500">Get help and guidance</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Lots Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Lots</h2>
        </div>
        <div className="p-6">
          <DataTable
            data={recentLots}
            columns={lotColumns}
            pageSize={10}
            searchable={true}
            searchPlaceholder="Search lots..."
            onRowClick={(lot) => onViewLot(lot.id)}
            emptyMessage="No lots created yet. Create your first lot to get started!"
          />
        </div>
      </div>
    </div>
  )
}