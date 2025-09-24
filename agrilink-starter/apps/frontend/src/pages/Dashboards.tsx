import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import KpiCard from '../components/data/KpiCard'
import { DataTable, Column } from '../components/data/DataTable'
import Modal from '../components/common/Modal'
import CreateLotView from './Farmer/CreateLotView'

function RoleNav(){
  return (
    <div className="flex gap-3 mb-4">
      <Link className="underline" to="farmer">Farmer</Link>
      <Link className="underline" to="buyer">Buyer</Link>
      <Link className="underline" to="inspector">Inspector</Link>
      <Link className="underline" to="admin">Admin</Link>
    </div>
  )
}

const Block = ({title, children}:{title:string, children:React.ReactNode}) => (
  <div className="rounded-xl border p-4 bg-white">
    <h3 className="font-semibold mb-2">{title}</h3>
    <div className="text-sm">{children}</div>
  </div>
)

type LotRow = { lot: string; produce: string; status: string; updated: string }

function Farmer(){
  const [open, setOpen] = useState(false)
  const lots: LotRow[] = []
  const columns: Column<LotRow>[] = [
    { key: 'lot', header: 'Lot' },
    { key: 'produce', header: 'Produce' },
    { key: 'status', header: 'Status' },
    { key: 'updated', header: 'Last Updated' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="My Lots" value={0} />
        <KpiCard label="Avg Temp" value={'—'} />
        <KpiCard label="Avg Hum" value={'—'} />
        <KpiCard label="Alerts" value={0} />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">My Lots</h3>
        <button onClick={() => setOpen(true)} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create Lot</button>
      </div>
      <DataTable columns={columns} data={lots} />

      <Modal title="Create Lot" open={open} onClose={() => setOpen(false)}>
        <CreateLotView onDone={() => setOpen(false)} />
      </Modal>
    </div>
  )
}

function Buyer(){
  return (<div className="grid md:grid-cols-2 gap-4">
    <Block title="Orders">Negotiate & order directly from farms.</Block>
    <Block title="Traceability">Verify origin & cold-chain.</Block>
  </div>)
}

function Inspector(){
  return (<div className="grid md:grid-cols-2 gap-4">
    <Block title="Audits">Perform farm & lot audits.</Block>
    <Block title="Certificates">Issue AgriLink Certified.</Block>
  </div>)
}

function Admin(){
  return (<div className="grid md:grid-cols-2 gap-4">
    <Block title="Users & Roles">Manage accounts & permissions.</Block>
    <Block title="Logistics">Configure routes & partners.</Block>
  </div>)
}

export default function Dashboards(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Role-based Dashboards</h2>
      <RoleNav/>
      <Routes>
        <Route path="farmer" element={<Farmer/>} />
        <Route path="buyer" element={<Buyer/>} />
        <Route path="inspector" element={<Inspector/>} />
        <Route path="admin" element={<Admin/>} />
      </Routes>
    </div>
  )
}
