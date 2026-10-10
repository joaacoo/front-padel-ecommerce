export default function FormField({ label, name, error, children, ...inputProps }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {children ?? <input id={name} name={name} aria-invalid={!!error} {...inputProps} />}
      {error && <span className="form-error" role="alert">{error}</span>}
    </div>
  )
}