import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

interface CVRequestCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled: boolean;
}

export const CVRequestCheckbox = ({ checked, onCheckedChange, disabled }: CVRequestCheckboxProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-3 bg-[#0D2B59] p-4 rounded-lg border border-[#2A4E8A] hover:border-[#3A6EAA] transition-colors">
      <Checkbox
        id="requestCV"
        checked={checked}
        disabled={disabled}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="h-5 w-5 border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
      />
      <label
        htmlFor="requestCV"
        className="text-base font-medium text-white cursor-pointer hover:text-blue-200 transition-colors"
      >
        {t('contact.requestCV')}
      </label>
    </div>
  );
};