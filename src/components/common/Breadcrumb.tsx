import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: ReactNode;
  className?: string;
  activeClassName?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
}

const Breadcrumb = ({
  items,
  separator = <span className="text-gray-500 text-sm font-medium">/</span>,
  className = "flex flex-wrap items-center gap-2 py-4",
  itemClassName = "text-gray-500 text-sm font-medium flex items-center gap-1 hover:text-[#0074bd] transition-colors",
  activeItemClassName = "text-[#0074bd] text-sm font-semibold",
}: BreadcrumbProps) => {
  return (
    <div className={className}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.url && !isLast ? (
              <Link to={item.url} className={item.className || itemClassName}>
                {item.icon && (
                  <span className="flex items-center">{item.icon}</span>
                )}
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  item.activeClassName || activeItemClassName || itemClassName
                }
              >
                {item.icon && (
                  <span className="flex items-center">{item.icon}</span>
                )}
                {item.label}
              </span>
            )}

            {!isLast && separator}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
