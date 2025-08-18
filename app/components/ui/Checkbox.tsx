interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
}

export function Checkbox({ checked, onChange, disabled = false, className = '', label }: CheckboxProps) {
    return (
        <label className={`inline-flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only"
            />
            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'bg-white border-border hover:border-accent'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                {checked && (
                    <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>
            {label && <span className="ml-2 text-sm text-black">{label}</span>}
        </label>
    );
}
