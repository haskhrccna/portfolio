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
    <div className="flex items-center space-x-2">
      <Checkbox
        id="requestCV"
        checked={checked}
        disabled={disabled}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="border-gray-700 disabled:opacity-50"
      />
      <label
        htmlFor="requestCV"
        className="text-sm text-gray-300 cursor-pointer"
      >
        {t('contact.requestCV')}
      </label>
    </div>
  );
};