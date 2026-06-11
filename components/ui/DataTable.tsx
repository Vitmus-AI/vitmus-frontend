interface TableColumn {
  header: string
  accessor: string
}

interface TableAction {
  icon: React.ReactNode
  onClick: (item: Record<string, unknown>) => void
  color?: string
}

interface DataTableProps {
  columns: TableColumn[]
  data: Record<string, unknown>[]
  actions?: TableAction[]
}

export function DataTable({ columns, data, actions }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-[var(--color-background-blue)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="text-left px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)]"
              >
                {column.header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="text-left px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)]">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors duration-200"
            >
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-4 py-3 text-sm text-[var(--color-text-secondary)]"
                >
                  {String(item[column.accessor] ?? '—')}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.onClick(item)}
                        className="p-2 rounded-md hover:bg-[var(--color-background-gray)] transition-colors duration-200"
                        style={action.color ? { color: action.color } : undefined}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
