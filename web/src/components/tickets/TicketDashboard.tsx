import { TicketList } from './TicketList';

export const TicketDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tickets Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="md:col-span-2">
          <TicketList />
        </div>
      </div>
    </div>
  );
};