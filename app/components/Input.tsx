'use client';

export default function Input({
  handleOnChange,
  label,
  purpose,
  ...props
}: {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  purpose: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-400" htmlFor={purpose}>
        {label}
      </label>
      <input
        {...props}
        className="mt-1 px-2 py-3 block w-full rounded-md bg-gray-800 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 text-lg"
        id={purpose}
        onChange={handleOnChange}
      />
    </div>
  );
}
