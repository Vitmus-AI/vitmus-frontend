'use client'

interface TextFieldWithCounterProps {
  value: string
  onChange: (value: string) => void
  maxLength: number
  placeholder?: string
  isTextArea?: boolean
}

export function TextFieldWithCounter({
  value,
  onChange,
  maxLength,
  placeholder,
  isTextArea = false,
}: TextFieldWithCounterProps) {
  return (
    <div className="relative">
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="input-field min-h-[100px]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="input-field"
        />
      )}
      <span className="absolute right-2 bottom-2 text-xs text-[var(--color-text-secondary)]">
        {value.length}/{maxLength}
      </span>
    </div>
  )
}
