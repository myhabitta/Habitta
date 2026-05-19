'use client';

import type { ClientWithRelations } from '@habitta/types';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ClientsTable from '@/components/clients/ClientsTable';
import ClientsEmptyState from '@/components/clients/ClientsEmptyState';

interface ClientsTabsProps {
  clients: ClientWithRelations[];
  hasFilters: boolean;
}

const ClientsTabs = ({ clients, hasFilters }: ClientsTabsProps) => {
  const [activeTab, setActiveTab] = useState('en_proceso');
  const finalized = clients.filter(
    (c) => c.construction_phase === 5 && c.delivered_at !== null
  );
  const inProgress = clients.filter(
    (c) => c.construction_phase !== 5 || c.delivered_at === null
  );

  return (
    <Tabs defaultValue="en_proceso" onValueChange={setActiveTab}>
      <TabsList className="mb-4 h-11 w-full gap-1 bg-transparent p-0 sm:w-auto">
        <TabsTrigger
          value="en_proceso"
          className="flex-1 gap-1.5 rounded-lg border border-transparent font-sans text-sm font-medium transition-all sm:flex-initial"
          style={
            activeTab === 'en_proceso'
              ? { backgroundColor: 'var(--habitta-accent-tint)', color: 'var(--habitta-accent)', borderColor: 'var(--habitta-accent)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
              : {}
          }
        >
          En proceso
          <span
            className="rounded-full px-1.5 py-0.5 text-xs font-bold"
            style={{ backgroundColor: 'var(--habitta-accent-tint)', color: 'var(--habitta-accent)' }}
          >
            {inProgress.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="finalizados"
          className="flex-1 gap-1.5 rounded-lg border border-transparent font-sans text-sm font-medium transition-all sm:flex-initial"
          style={
            activeTab === 'finalizados'
              ? { backgroundColor: 'var(--success-tint)', color: 'var(--success)', borderColor: 'var(--success)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
              : {}
          }
        >
          Finalizados
          <span
            className="rounded-full px-1.5 py-0.5 text-xs font-bold"
            style={{ backgroundColor: 'var(--success-tint)', color: 'var(--success)' }}
          >
            {finalized.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="en_proceso">
        {inProgress.length === 0 ? (
          <ClientsEmptyState hasFilters={hasFilters} />
        ) : (
          <ClientsTable clients={inProgress} />
        )}
      </TabsContent>

      <TabsContent value="finalizados">
        {finalized.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <p className="font-sans text-sm text-muted-foreground">
              Aún no hay clientes finalizados
            </p>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Un cliente se finaliza cuando llega a fase Terminado y se marca como entregado
            </p>
          </div>
        ) : (
          <ClientsTable clients={finalized} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ClientsTabs;
