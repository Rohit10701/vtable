"use client"
import React, { useEffect, useRef, useState } from 'react';
import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Order, OrdersResponse, SortConfig } from '../utils/types';

interface VirtualTableProps {
  rowHeight?: number;
  containerHeight?: number;
}

export default function VirtualTable({ 
  rowHeight = 50,
  containerHeight = 600 
}: VirtualTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortConfig>({
    field: 'createdAt',
    direction: 'desc'
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery<OrdersResponse, Error, InfiniteData<OrdersResponse>, QueryKey, string>({
    queryKey: ['orders', sorting],
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        cursor: pageParam,
        limit: '10',
        sort: sorting.field,
        sortDirection: sorting.direction
      });
      
      const response = await fetch(`http://localhost:3001/v1/api/orders?${params}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: OrdersResponse = await response.json();
      return data;
    },
    getNextPageParam: (lastPage: OrdersResponse) => lastPage.nextCursor ?? undefined,
  });

  const allRows = data?.pages.flatMap(page => page.data) ?? [];
  
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems()
  ]);

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }

  const handleSort = (field: keyof Order) => {
    setSorting(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div
      ref={parentRef}
      className="border border-gray-200 rounded-lg overflow-auto"
      style={{ height: containerHeight, color : "black" }}
    >
      <div className="sticky top-0 bg-gray-100 z-10">
        <div className="grid grid-cols-5 gap-4 px-4 py-2 font-semibold">
          <button
            onClick={() => handleSort('customerName')}
            className="text-left hover:bg-gray-200 p-2 rounded flex items-center"
          >
            <span>Customer Name</span>
            {sorting.field === 'customerName' && (
              <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
          <button
            onClick={() => handleSort('orderAmount')}
            className="text-left hover:bg-gray-200 p-2 rounded flex items-center"
          >
            <span>Amount</span>
            {sorting.field === 'orderAmount' && (
              <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
          <button
            onClick={() => handleSort('status')}
            className="text-left hover:bg-gray-200 p-2 rounded flex items-center"
          >
            <span>Status</span>
            {sorting.field === 'status' && (
              <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
          <button
            onClick={() => handleSort('createdAt')}
            className="text-left hover:bg-gray-200 p-2 rounded flex items-center"
          >
            <span>Created At</span>
            {sorting.field === 'createdAt' && (
              <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
          <div>Items</div>
        </div>
      </div>

      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const order = allRows[virtualRow.index] as Order;
          const isLoaderRow = virtualRow.index > allRows.length - 1;

          return (
            <div
              key={virtualRow.index}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className={`absolute top-0 left-0 w-full ${
                virtualRow.index % 2 ? 'bg-gray-50' : 'bg-white'
              }`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                height: `${virtualRow.size}px`,
              }}
            >
              {isLoaderRow ? (
                <div className="flex items-center justify-center w-full h-full">
                  {isFetchingNextPage ? 'Loading more...' : 'Nothing more to load'}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-4 px-4 py-2">
                  <div className="truncate">{order.customerName}</div>
                  <div>${order.orderAmount.toFixed(2)}</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                    {
                      pending: 'bg-yellow-100 text-yellow-800',
                      processing: 'bg-blue-100 text-blue-800',
                      completed: 'bg-green-100 text-green-800',
                      cancelled: 'bg-red-100 text-red-800'
                    }[order.status]
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                  <div>{order.items.length} items</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}