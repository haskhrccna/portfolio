import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface CVRequestSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CVRequestSelector = ({ value, onValueChange }: CVRequestSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">CV Request in Contact Form</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="enabled">
            <div className="flex items-center">
              <ToggleRight className="mr-2 h-4 w-4 text-green-500" />
              Enabled
            </div>
          </SelectItem>
          <SelectItem value="disabled">
            <div className="flex items-center">
              <ToggleLeft className="mr-2 h-4 w-4 text-red-500" />
              Disabled
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">
        {value === 'enabled' 
          ? "Users can request your CV through the contact form"
          : "CV request option is hidden in the contact form"
        }
      </p>
    </div>
  );
};