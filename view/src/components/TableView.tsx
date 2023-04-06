import { Box, Button, Flex } from 'theme-ui'
import { RelationView } from '../App'
import * as api from '../api'

interface TableViewProps {
  relationView: RelationView
  actions?: Array<{
    name: string
    handler: (row: any) => void
    props?: any
  }>
}

const TableView = ({ relationView, actions = [] }: TableViewProps) => {
  return (
    <Box>
      {/* <p>The view of you relation:</p> */}
      {relationView.columns.length > 0 && (
        <table>
          <tbody>
            <tr>
              {relationView.columns.map((col, colIndex) => {
                return !col.includes('id') ? (
                  <th key={colIndex}>{col}</th>
                ) : null
              })}
              {actions.length !== 0 && <th>Actions</th>}
            </tr>
            {relationView.rows.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {relationView.columns.map((col, colIndex) => {
                    row[col]
                    return !col.includes('id') ? (
                      <td key={colIndex}>{row[col]?.toString()}</td>
                    ) : null
                  })}
                  {actions.length !== 0 && (
                    <td>
                      <Flex sx={{ gap: 1 }}>
                        {actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            onClick={() => action.handler(row)}
                            {...action.props}>
                            {action.name}
                          </Button>
                        ))}
                      </Flex>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </Box>
  )
}

export default TableView
