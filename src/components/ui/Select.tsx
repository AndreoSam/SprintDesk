import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

function Select({
  label,
  id,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        className={`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export default Select;
