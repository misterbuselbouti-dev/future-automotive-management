import { Button } from '@/components/ui/Button'
import { StatutBadge } from './StatutBadge'
import { PrioriteBadge } from './PrioriteBadge'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface AchatTableProps {
  data: any[]
  columns: Column[]
  actions?: {
    view?: (row: any) => void
    edit?: (row: any) => void
    delete?: (row: any) => void
    approve?: (row: any) => void
    reject?: (row: any) => void
    print?: (row: any) => void
    [key: string]: ((row: any) => void) | undefined
  }
}

export function AchatTable({ data, columns, actions }: AchatTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {actions.view && (
                        <button
                          onClick={() => actions.view!(row)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir
                        </button>
                      )}
                      {actions.edit && (
                        <button
                          onClick={() => actions.edit!(row)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Modifier
                        </button>
                      )}
                      {actions.approve && (
                        <button
                          onClick={() => actions.approve!(row)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approuver
                        </button>
                      )}
                      {actions.reject && (
                        <button
                          onClick={() => actions.reject!(row)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Rejeter
                        </button>
                      )}
                      {actions.print && (
                        <button
                          onClick={() => actions.print!(row)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Imprimer
                        </button>
                      )}
                      {actions.delete && (
                        <button
                          onClick={() => actions.delete!(row)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
