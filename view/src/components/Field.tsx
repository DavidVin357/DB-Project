interface FieldProps {
  fieldName: string
  fieldType: string
  title: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Field = (props: FieldProps) => {
  return (
    <div style={{ paddingBottom: '10px' }}>
      <p>{props.title}: </p>
      <input
        name={props.fieldName}
        type={props.fieldType}
        onChange={props.onChange}
      />
    </div>
  )
}

export default Field
