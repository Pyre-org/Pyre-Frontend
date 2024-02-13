import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@renderer/components/ui/popover";
import { cn } from "@renderer/lib/utils";
import { ChevronsUpDown, XIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@renderer/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";
import { Input } from "@renderer/components/ui/input";
import {
  CreateChannelSchema,
  CreateChannelSchemaType,
} from "@renderer/lib/schemas/CreateChannelSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@renderer/components/ui/button";
import {
  useCreateChannelMutation,
  useEditChannelMutation,
  useGetChannel,
  useGetGenres,
} from "@renderer/lib/queries/channel";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@renderer/components/ui/dialog";
import { useDebouncedValue } from "@mantine/hooks";
import { AxiosError } from "axios";
import { BaseError } from "@renderer/types/schema";
import { toast } from "../ui/use-toast";
import Dropzone from "../common/Dropzone";
import { useUploadFileToS3Mutation } from "@renderer/lib/queries/upload";

interface ChannelCreateForm {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  editChannelId?: string | null;
}

const defaultValues = {
  title: "",
  description: "",
  genre: "GENERAL",
  imageUrl: "",
};

function ChannelCreateForm({
  open,
  setOpen,
  editChannelId,
}: ChannelCreateForm) {
  const { data: editChannelData } = useGetChannel(editChannelId ?? "", {
    enabled: !!editChannelId,
  });
  const methods = useForm<CreateChannelSchemaType>({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues,
  });
  const [genreKeyword, setGenreKeyword] = useState("");
  const [debounced] = useDebouncedValue(genreKeyword, 250);
  const { data: genreData } = useGetGenres(
    { name: debounced },
    { placeholderData: (previousData) => previousData },
  );
  const [openGenre, setOpenGenre] = useState(false);
  const createChannelMutation = useCreateChannelMutation();
  const editChannelMutation = useEditChannelMutation();
  const uploadMutation = useUploadFileToS3Mutation();
  const isEdit = !!editChannelId;

  const onMutationSuccess = useCallback(() => {
    setOpen(false);
    toast({
      title: `채널 ${isEdit ? "수정" : "등록"} 완료`,
      description: `채널 ${isEdit ? "수정" : "등록"}이 완료되었습니다.`,
      color: "green",
      duration: 1500,
    });
  }, [isEdit]);

  const onMutationError = useCallback(
    (error: AxiosError<BaseError>) => {
      toast({
        title: `채널 ${isEdit ? "수정" : "등록"} 중 오류기 발생했습니다.`,
        description: error.response?.data.reason,
        color: "red",
        duration: 1500,
      });
    },
    [isEdit],
  );

  const onSubmit = (data: CreateChannelSchemaType) => {
    methods.reset();
    if (!isEdit) {
      createChannelMutation.mutate(data, {
        onSuccess: onMutationSuccess,
        onError: onMutationError,
      });
    } else {
      editChannelMutation.mutate(
        { id: editChannelId, ...data },
        {
          onSuccess: onMutationSuccess,
          onError: onMutationError,
        },
      );
    }
  };
  const onError = (errors: any) => {
    console.log(errors);
  };

  useEffect(() => {
    if (editChannelId && editChannelData) {
      methods.reset({
        title: editChannelData.title,
        description: editChannelData.description,
        genre: editChannelData.genre,
        imageUrl: editChannelData.imageUrl,
      });
    } else {
      methods.reset(defaultValues);
    }
  }, [editChannelData, editChannelId]);

  const genres = genreData?.hits ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80%] overflow-y-scroll scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{isEdit ? "채널 수정" : "새 채널 생성"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `'${editChannelData?.title}' 채널을 수정합니다`
              : "채널을 생성합니다"}
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={methods.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>채널 이름</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>채널 설명</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="genre"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>장르</FormLabel>
                  <Popover open={openGenre} onOpenChange={setOpenGenre}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                          onClick={() => setOpenGenre((show) => !show)}
                        >
                          {field.value ?? "장르를 선택해주세요"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="장르를 검색해보세요"
                          onValueChange={setGenreKeyword}
                          value={genreKeyword}
                        />
                        <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
                        <CommandGroup value={field.value}>
                          {genres.map((genre) => (
                            <CommandItem
                              className="cursor-pointer"
                              value={genre}
                              key={genre}
                              onSelect={() => {
                                methods.setValue("genre", genre);
                                setOpenGenre(false);
                              }}
                            >
                              {genre}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이미지</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={(files) => {
                        const file = files[0];
                        if (file) {
                          uploadMutation.mutate(file, {
                            onSuccess: (url) => {
                              field.onChange(url);
                            },
                            onError: (error: AxiosError<BaseError>) => {
                              toast({
                                title: "이미지 업로드 중 오류가 발생했습니다.",
                                description: error.response?.data.reason,
                                color: "red",
                                duration: 1500,
                              });
                            },
                          });
                        }
                      }}
                      dropzoneProps={{
                        accept: { "image/*": [] },
                        multiple: false,
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-8 relative">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-0 top-0"
                        onClick={() => field.onChange("")}
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                      <img src={field.value} alt="img" />
                    </div>
                  )}
                </FormItem>
              )}
            />
            {/* <FormField
              control={methods.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>채널 이미지 URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <DialogFooter>
              <Button type="submit">{isEdit ? "수정" : "생성"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(ChannelCreateForm);
