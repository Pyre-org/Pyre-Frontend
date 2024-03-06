import React from "react";
import FormBase from "./FormBase";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover";
import { FormControl } from "@renderer/components/ui/form";
import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@renderer/components/ui/command";
import { useDebounce, useMeasure } from "@uidotdev/usehooks";

interface FormComboBoxProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  keyword: string;
  setKeyword: (keyword: string) => void;
  options: IComboxBoxItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
}

interface IComboxBoxItem {
  value: string | number | undefined;
  label: string;
}

function FormComboBox<T extends FieldValues>(props: FormComboBoxProps<T>) {
  const {
    options: initialOptions,
    placeholder,
    searchPlaceholder,
    keyword,
    setKeyword,
    commandProps,
    ...rest
  } = props;
  const [open, setOpen] = React.useState(false);
  const [squareRef, { width }] = useMeasure();
  const debouncedKeyword = useDebounce(keyword, 300);
  const options = initialOptions.filter((option) =>
    option.label.toLowerCase().includes(debouncedKeyword.toLowerCase()),
  );

  return (
    <FormBase {...rest}>
      {({ field }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                ref={(el) => {
                  squareRef(el);
                  field.ref(el);
                }}
                variant="outline"
                role="combobox"
                className={cn(
                  "flex justify-between",
                  !field.value && "text-muted-foreground",
                )}
                onClick={() => setOpen((show) => !show)}
                fullWidth
              >
                {options.find((option) => option.value === field.value)
                  ?.label ??
                  placeholder ??
                  "값을 선택해주세요"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="p-0" style={{ width: width ?? 0 }}>
            <Command shouldFilter={false} {...commandProps}>
              <CommandInput
                placeholder={searchPlaceholder ?? "값을 검색해보세요"}
                onValueChange={setKeyword}
                value={keyword}
              />
              {(initialOptions.length > 0 || keyword) && (
                <CommandEmpty>
                  <span className="text-muted-foreground text-sm">
                    검색 결과가 없습니다
                  </span>
                </CommandEmpty>
              )}
              <CommandGroup>
                {initialOptions.length > 0 || keyword ? (
                  options.map((option) => (
                    <CommandItem
                      className="cursor-pointer"
                      key={option.value}
                      value={
                        typeof option.value === "undefined"
                          ? undefined
                          : option.value.toString()
                      }
                      onSelect={() => {
                        field.onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    검색 결과가 없습니다
                  </div>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </FormBase>
  );
}

export default FormComboBox;
