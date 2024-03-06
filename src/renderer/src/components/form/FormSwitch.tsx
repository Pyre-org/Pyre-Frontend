import FormBase from "./FormBase";
import { Control, FieldValues, Path } from "react-hook-form";
import { Switch } from "@renderer/components/ui/switch";

interface FormSwitchProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
}

function FormSwitch<T extends FieldValues>(props: FormSwitchProps<T>) {
  const { ...rest } = props;
  return (
    <FormBase
      {...rest}
      classes={{
        formItem: "flex gap-3 items-center relative",
        formControl: "!m-0",
      }}
    >
      {({ field }) => (
        <Switch
          ref={field.ref}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      )}
    </FormBase>
  );
}

export default FormSwitch;
