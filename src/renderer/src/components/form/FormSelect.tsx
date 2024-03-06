import FormBase from "./FormBase";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  placeholder?: string;
  options: { label: string; value: string }[];
}

function FormSelect<T extends FieldValues>(props: FormSelectProps<T>) {
  const { options, placeholder, ...rest } = props;
  return (
    <FormBase {...rest}>
      {({ field }) => (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger ref={field.ref}>
            <SelectValue placeholder={placeholder ?? "값을 선택해주세요"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormBase>
  );
}

export default FormSelect;
