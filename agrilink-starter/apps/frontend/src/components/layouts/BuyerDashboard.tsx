import React from 'react'
import { KpiCard, DataTable, StatusBadge } from '../data/DataComponents'
import { PurchaseOrder } from '../../schemas/buyer'

interface BuyerDashboardProps {
  user: {
    name: string
    email: string
    companyName?: string
  }
  stats: {
    totalOrders: number
    activeOrders: number
    pendingPayments: number
    totalSpent: number
    averageOrderValue: number
    savedSuppliers: number
  }
  recentOrders: PurchaseOrder[]
  availableLots: Array<{
    id: string
    publicId: string
    crop: string
    variety: string
    quantity: number
    grade: string
    pricePerUnit: number
    farmerName: string
    location: string
    harvestDate: string
  }>
  onPlaceBid: (lotId: string) => void
  onViewOrder: (orderId: string) => void
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  user,
  stats,
  recentOrders,
  availableLots,
  onPlaceBid,
  onViewOrder
}) => {
  const orderColumns = [
    {
      key: 'id' as keyof PurchaseOrder,
      label: 'Order ID',
      sortable: true,
      width: '120px',
      render: (value: string) => `#${value.slice(-6)}`
    },
    {
      key: 'farmerId' as keyof PurchaseOrder,
      label: 'Supplier',
      sortable: true
    },
    {
      key: 'totalAmount' as keyof PurchaseOrder,
      label: 'Amount',
      sortable: true,
      render: (value: number) => `₿${value.toLocaleString()}`
    },
    {
      key: 'status' as keyof PurchaseOrder,
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        const variant = value === 'COMPLETED' ? 'success' : 
                      value === 'IN_TRANSIT' ? 'info' : 
                      value === 'PENDING' ? 'warning' : 
                      value === 'CANCELLED' ? 'danger' : 'default'
        return <StatusBadge status={value} variant={variant} />
      }
    },
    {
      key: 'paymentStatus' as keyof PurchaseOrder,
      label: 'Payment',
      sortable: true,
      render: (value: string) => {
        const variant = value === 'PAID' ? 'success' : 
                      value === 'PARTIAL' ? 'warning' : 
                      value === 'OVERDUE' ? 'danger' : 'default'
        return <StatusBadge status={value} variant={variant} />
      }
    },
    {
      key: 'deliveryDate' as keyof PurchaseOrder,
      label: 'Delivery Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ]

  type AvailableLot = {
    id: string
    publicId: string
    crop: string
    variety: string
    quantity: number
    grade: string
    pricePerUnit: number
    farmerName: string
    location: string
    harvestDate: string
  }

  const lotColumns = [
    {
      key: 'publicId' as keyof AvailableLot,
      label: 'Lot ID',
      sortable: true,
      width: '120px'
    },
    {
      key: 'crop' as keyof AvailableLot,
      label: 'Crop',
      sortable: true
    },
    {
      key: 'variety' as keyof AvailableLot,
      label: 'Variety',
      sortable: true
    },
    {
      key: 'quantity' as keyof AvailableLot,
      label: 'Quantity',
      sortable: true,
      render: (value: number) => `${value.toLocaleString()} kg`
    },
    {
      key: 'grade' as keyof AvailableLot,
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
      key: 'pricePerUnit' as keyof AvailableLot,
      label: 'Price/kg',
      sortable: true,
      render: (value: number) => `₿${value}`
    },
    {
      key: 'farmerName' as keyof AvailableLot,
      label: 'Farmer',
      sortable: true
    },
    {
      key: 'location' as keyof AvailableLot,
      label: 'Location',
      sortable: true
    },
    {
      key: 'harvestDate' as keyof AvailableLot,
      label: 'Harvest',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'id' as keyof AvailableLot,
      label: 'Action',
      render: (value: string) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlaceBid(value)
          }}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Place Bid
        </button>
      )
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
          {user.companyName ? `${user.companyName}` : 'Find quality produce for your business'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          color="blue"
        />
        
        <KpiCard
          title="Active Orders"
          value={stats.activeOrders}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        
        <KpiCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="red"
        />
        
        <KpiCard
          title="Total Spent"
          value={`₿${stats.totalSpent.toLocaleString()}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="purple"
        />
        
        <KpiCard
          title="Avg Order Value"
          value={`₿${stats.averageOrderValue.toLocaleString()}`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="yellow"
        />
        
        <KpiCard
          title="Saved Suppliers"
          value={stats.savedSuppliers}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Browse Lots</p>
              <p className="text-xs text-gray-500">Find quality produce</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Track Payments</p>
              <p className="text-xs text-gray-500">Manage invoices</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Suppliers</p>
              <p className="text-xs text-gray-500">Manage relationships</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Analytics</p>
              <p className="text-xs text-gray-500">Purchase insights</p>
            </div>
          </button>
        </div>
      </div>

      {/* Available Lots */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Lots</h2>
        </div>
        <div className="p-6">
          <DataTable
            data={availableLots}
            columns={lotColumns}
            pageSize={5}
            searchable={true}
            searchPlaceholder="Search available lots..."
            emptyMessage="No lots available at the moment."
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="p-6">
          <DataTable
            data={recentOrders}
            columns={orderColumns}
            pageSize={10}
            searchable={true}
            searchPlaceholder="Search orders..."
            onRowClick={(order) => onViewOrder(order.id)}
            emptyMessage="No orders placed yet. Browse available lots to get started!"
          />
        </div>
      </div>
    </div>
  )
}