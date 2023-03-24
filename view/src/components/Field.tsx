interface FieldProps {
  fieldName: string
  fieldType: string
  title: string
  value: any
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Field = (props: FieldProps) => {
  return (
    <div style={{ paddingBottom: '10px' }}>
      <p>{props.title}: </p>
      <input
        name={props.fieldName}
        type={props.fieldType}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  )
}

export default Field
