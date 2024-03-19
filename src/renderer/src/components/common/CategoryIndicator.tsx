import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";

interface CategoryItem {
  label: string;
  link: string;
}

interface CategoryIndicatorProps {
  categories: CategoryItem[];
}

function CategoryIndicator({ categories }: CategoryIndicatorProps) {
  return (
    <div className="flex items-center truncate gap-2">
      {categories.map((category, index) => (
        <React.Fragment key={category.link}>
          <Button variant="link" className="p-0" asChild>
            <Link to={category.link}>{category.label}</Link>
          </Button>
          {index < categories.length - 1 && (
            <ChevronRightIcon className="size-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CategoryIndicator;
