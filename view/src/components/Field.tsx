import { Label, Input, Box } from 'theme-ui'
interface FieldProps {
  fieldName: string
  fieldType: string
  title: string
  value: any
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Field = (props: FieldProps) => {
  return (
    <Box style={{ paddingBottom: '10px' }}>
      <Label htmlFor={props.fieldName}>{props.title}</Label>
      <Input
        name={props.fieldName}
        id={props.fieldName}
        mb={3}
        value={props.value}
        onChange={props.onChange}
        type={props.fieldType}
      />

      {/* <p>{props.title}: </p>
      <input
        name={props.fieldName}
        type={props.fieldType}
        value={props.value}
        onChange={props.onChange}
      /> */}
    </Box>
  )
}

export default Field
