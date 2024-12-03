import { GET_FILTERED_TICKETS } from '../../types/ticket';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { Ticket, TicketStatus } from '../../types/ticket';

export const TicketList = () => {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  // const { loading, error, data } = useQuery(GET_TICKETS);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  
  const { loading, error, data, refetch } = useQuery(GET_FILTERED_TICKETS, {
    variables: {
      status: selectedStatus || undefined,
      searchTerm: searchTerm || undefined,
    },
  });

  console.log('Query Response:', { loading, error, data }); // Add this for debugging

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TicketStatus | '';
    setSelectedStatus(status);
    refetch({
      status: status || undefined,
      searchTerm: searchTerm || undefined,
    });
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debouncing
    const timeoutId = setTimeout(() => {
      refetch({
        status: selectedStatus || undefined,
        searchTerm: term || undefined,
      });
      searchInputRef.current?.focus();  // Restore focus using ref
    }, 600);

    setSearchTimeout(timeoutId);
  };

  const clearFilters = () => {
    setSelectedStatus('');
    setSearchTerm('');
    refetch({
      status: undefined,
      searchTerm: undefined,
    });
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Tickets
          </label>
          <input
            ref={searchInputRef}
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            placeholder="Search by title or description..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                     p-2 border"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Filter by Status
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                     focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                     p-2 border"
          >
            <option value="">All Statuses</option>
            {Object.values(TicketStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {(selectedStatus || searchTerm) && (
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 
                     bg-gray-100 border border-gray-300 rounded-md 
                     hover:bg-gray-200 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        )}

        {/* Active Filters Display */}
        {(selectedStatus || searchTerm) && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedStatus && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full 
                             text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {selectedStatus.replace(/_/g, ' ')}
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full 
                             text-xs font-medium bg-blue-100 text-blue-800">
                  Search: {searchTerm}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tickets List */}
      <div className="grid gap-4 scrollable-container h-[calc(100vh-theme(spacing.64))]">
        {data.tickets.map((ticket: Ticket) => (
          <div key={ticket.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold">{ticket.title}</h3>
            <p className="text-gray-600">{ticket.description}</p>
            <div className="mt-2">
              <span className="px-2 py-1 text-sm rounded-full bg-blue-100">
                {ticket.status}
              </span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Messages:</h4>
              {ticket.messages.map((message) => (
                <div key={message.id} className="mt-2 p-2 bg-gray-50 rounded">
                  <p>{message.content}</p>
                  <small className="text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
