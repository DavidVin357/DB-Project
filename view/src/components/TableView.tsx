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
          <tr>
            {relationView.columns.map((col) => {
              return col !== 'id' ? <th>{col}</th> : null
            })}
            {actions.length !== 0 && <th>Actions</th>}
          </tr>
          {relationView.rows.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {relationView.columns.map((col, colIndex) => {
                  row[col]
                  return col !== 'id' ? (
                    <td key={colIndex}>{row[col].toString()}</td>
                  ) : null
                })}
                {actions.length !== 0 && (
                  <td>
                    <Flex sx={{ gap: 1 }}>
                      {actions.map((action) => (
                        <Button
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
        </table>
      )}
    </Box>
  )
}

export default TableView
