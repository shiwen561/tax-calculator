import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  placeholder?: string
  suffix?: string
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, placeholder, suffix, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type="number"
            placeholder={placeholder}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {suffix}
            </span>
          )}
        </div>
      </div>
    )
  }
)

InputField.displayName = 'InputField'

export default InputField
