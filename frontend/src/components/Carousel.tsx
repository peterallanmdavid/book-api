import React from "react";

interface CarouselProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  viewAllLink?: string;
  addLink?: string;
  viewAllLabel?: string;
  noItemsMessage?: string;
  isLoading?: boolean; // Added loading state
}

const Carousel = <T,>({
  title,
  items,
  renderItem,
  viewAllLink,
  addLink,
  viewAllLabel = "View All",
  noItemsMessage = "No items yet",
  isLoading = false,
}: CarouselProps<T>) => {
  return (
    <div className="flex flex-col justify-between mb-8 gap-4">
      {/* Header */}
      <div className="flex flex-row items-center">
        <h1 className="text-2xl font-bold flex-1">{title}</h1>
        {items.length
          ? viewAllLink && (
              <a href={viewAllLink} className="text-blue-500 hover:underline">
                {`${viewAllLabel} (${items.length})`}
              </a>
            )
          : addLink &&
            !isLoading && (
              <a
                href={addLink}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Item
              </a>
            )}
      </div>

      {/* Carousel Items */}
      <div className="flex overflow-x-auto gap-4 scrollbar-hide">
        {isLoading ? (
          <div className="text-center text-gray-500 text-lg animate-pulse">
            Loading...
          </div>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              {renderItem(item)}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg">
            {noItemsMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
