import React from 'react'

export interface Column<T> {
  key: keyof T
  header: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyText?: string
}

export function DataTable<T extends Record<string, any>>({ columns, data, emptyText = 'No data yet' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-center text-sm text-gray-500 bg-white">{emptyText}</div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-700">
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
