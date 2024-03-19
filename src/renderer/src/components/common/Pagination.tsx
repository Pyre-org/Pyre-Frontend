import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from "@renderer/components/ui/pagination";
import _ from "lodash-es";
import { useLocation, useSearchParams } from "react-router-dom";
import { cn } from "@renderer/lib/utils";

// first page index is 0
interface PaginationProps {
  total: number;
  perPage: number;
  linkCount: number;
  pageParamName?: string;
}

function Pagination({
  total,
  perPage,
  linkCount,
  pageParamName = "page",
}: PaginationProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get(pageParamName) || "0");
  const pageCount = Math.ceil(total / perPage);
  const startPage = Math.floor(page / linkCount) * linkCount;
  const endPage = Math.max(
    0,
    Math.min(pageCount - 1, startPage + linkCount - 1),
  );
  const hasNextPage = endPage < pageCount - 1;
  const hasPrevPage = startPage > 0;

  const genLink = (page: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(pageParamName, page.toString());
    return `${location.pathname}?${searchParams.toString()}`;
  };

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem
          className={cn(!hasPrevPage && "opacity-50 pointer-events-none")}
        >
          <PaginationPrevious to={genLink(Math.max(0, startPage - 1))} />
        </PaginationItem>
        {_.range(startPage, endPage + 1).map((i) => (
          <PaginationItem key={i}>
            <PaginationLink isActive={i === page} to={genLink(i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem
          className={cn(!hasNextPage && "opacity-50 pointer-events-none")}
        >
          <PaginationNext to={genLink(Math.min(pageCount - 1, endPage + 1))} />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}

export default Pagination;
