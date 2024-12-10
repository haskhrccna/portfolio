import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
  disabled?: boolean;
}

export const FormField = ({ label, name, type = "text", required = false, disabled = false }: FormFieldProps) => {
  const Component = type === "textarea" ? Textarea : Input;
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label} {required && "*"}
      </label>
      <Component
        id={name}
        name={name}
        type={type === "textarea" ? undefined : type}
        required={required}
        disabled={disabled}
        className={`w-full bg-[#1C2537] border-gray-700 text-white disabled:opacity-50 ${
          type === "textarea" ? "min-h-[150px]" : ""
        }`}
      />
    </div>
  );
};