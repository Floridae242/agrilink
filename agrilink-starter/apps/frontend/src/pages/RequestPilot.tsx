import React from 'react'
import Button from '../components/ui/button'

export default function RequestPilot(){
  const [sent, setSent] = React.useState(false)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: POST to backend /api/pilot
    setSent(true)
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Request Pilot Access</h2>
      {!sent ? (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input required className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" required className="mt-1 w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select className="mt-1 w-full rounded-xl border px-3 py-2">
                <option>Farmer</option><option>Buyer</option><option>Inspector</option><option>Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea rows={4} className="mt-1 w-full rounded-xl border px-3 py-2"></textarea>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      ) : (
        <p className="text-green-700">Thanks! We'll get back to you shortly.</p>
      )}
    </div>
  )
}
