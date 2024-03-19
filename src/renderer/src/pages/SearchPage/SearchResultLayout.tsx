import Loader from "@renderer/components/common/Loader";
import Pagination from "@renderer/components/common/Pagination";
import React, { ReactNode } from "react";

interface SearchResultLayoutProps<T> {
  renderItem: (item: T) => ReactNode;
  items: T[];
  total: number;
  size: number;
  isLoading: boolean;
}

function SearchResultLayout<T extends { id: string }>({
  renderItem,
  items,
  total,
  size,
  isLoading,
}: SearchResultLayoutProps<T>) {
  if (isLoading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold text-lg">전체 {total.toLocaleString()}건</h2>
      <div className="flex flex-col gap-2">
        {total > 0 ? (
          items.map((item) => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))
        ) : (
          <p className="mx-auto text-sm text-muted-foreground py-8">
            검색 결과가 없습니다
          </p>
        )}
      </div>
      <div className="mt-6">
        <Pagination total={total} linkCount={5} perPage={size} />
      </div>
    </div>
  );
}

export default SearchResultLayout;
