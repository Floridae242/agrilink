import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

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

function Farmer(){
  return (<div className="grid md:grid-cols-2 gap-4">
    <Block title="My Lots">Create & manage produce lots. Print QR.</Block>
    <Block title="Quality">Track defects & Brix.</Block>
  </div>)
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
