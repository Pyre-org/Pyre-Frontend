import { Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@renderer/components/ui/checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import { cn } from "@renderer/lib/utils";

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  description?: string;
  label: string;
  control: Control<T>;
  checkboxProps?: CheckboxProps;
  reverse?: boolean;
}

function FormCheckbox<T extends FieldValues>({
  control,
  label,
  name,
  description,
  reverse,
  checkboxProps,
}: FormCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-4">
          <div
            className={cn("flex flex-row items-start gap-2 space-y-0 relative")}
          >
            <FormLabel
              className={cn(
                "cursor-pointer text-muted-foreground",
                reverse && "order-5",
              )}
            >
              {label}
            </FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                ref={field.ref}
                {...checkboxProps}
              />
            </FormControl>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormCheckbox;
