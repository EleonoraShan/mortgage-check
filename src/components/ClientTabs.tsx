import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { TooltipProvider } from '../components/ui/tooltip';
import {
  clearClientSessionFromStorage,
  loadActiveClientFromStorage,
  loadClientsFromStorage,
  saveActiveClientToStorage,
  saveClientsToStorage
} from '../lib/persistence';
import { ClientContextProvider } from './client-screen/client-provider';
import { ClientDataI, ClientStatus } from './client-screen/client.interfaces';
import { ClientWorkspace } from './client-workspace/ClientWorkspace';



export const ClientTabs = () => {
  const [clients, setClients] = useState<ClientDataI[]>([]);
  const [activeClient, setActiveClient] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedClients = loadClientsFromStorage();
    const storedActiveClient = loadActiveClientFromStorage();

    if (storedClients.length > 0) {
      setClients(storedClients);
      setActiveClient(storedActiveClient || storedClients[0].id);
    } else {
      // Initialize with default client if no stored data
      const defaultClient: ClientDataI = {
        id: '1',
        name: 'John Smith',
        loanAmount: 350000,
        depositAmount: 50000,
        employmentStatus: 'Employed (PAYE)',
        currentRole: 'Type information here',
        company: 'Type information here',
        propertyType: 'First-time buyer',
        status: 'Under review'
      };
      setClients([defaultClient]);
      setActiveClient('1');
      saveClientsToStorage([defaultClient]);
      saveActiveClientToStorage('1');
    }
    setIsInitialized(true);
  }, []);

  // Save clients to localStorage whenever clients change
  useEffect(() => {
    if (isInitialized && clients.length > 0) {
      saveClientsToStorage(clients);
    }
  }, [clients, isInitialized]);

  // Save active client to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && activeClient) {
      saveActiveClientToStorage(activeClient);
    }
  }, [activeClient, isInitialized]);

  const addClient = () => {
    if (newClientName.trim()) {
      const newClient: ClientDataI = {
        id: Date.now().toString(),
        name: newClientName.trim(),
        loanAmount: 300000,
        depositAmount: 30000,
        employmentStatus: 'Employed (PAYE)',
        currentRole: 'Type information here',
        company: 'Type information here',
        propertyType: 'First-time buyer',
        status: 'Under review'
      };
      setClients([...clients, newClient]);
      setActiveClient(newClient.id);
      setNewClientName('');
      setShowNewClientForm(false);
    }
  };

  const removeClient = (clientId: string) => {
    const updatedClients = clients.filter(c => c.id !== clientId);
    setClients(updatedClients);

    // Clear the session data for the removed client
    clearClientSessionFromStorage(clientId);

    if (activeClient === clientId && updatedClients.length > 0) {
      setActiveClient(updatedClients[0].id);
    }
  };

  const updateClient = (clientId: string, updates: Partial<ClientDataI>) => {
    setClients(clients.map(client =>
      client.id === clientId ? { ...client, ...updates } : client
    ));
  };

  const getStatusBadgeVariant = (status: ClientStatus, isActive: boolean) => {
    switch (status) {
      case 'Approved':
        return isActive ? 'outline' : 'default'; // Green
      case 'Under review':
        return 'warning'; // Yellow
      case 'Rejected':
        return 'destructive'; // Red
      default:
        return 'secondary';
    }
  };

  const activeClientData = clients.find(c => c.id === activeClient);

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-65px)] w-full overflow-hidden">
        {/* Left Sidebar - Client List */}
        <div className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 bg-card border-r border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
            <h2 className="text-lg font-semibold mb-3">Clients</h2>
            {showNewClientForm ? (
              <div className="space-y-2">
                <Input
                  placeholder="Client name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addClient()}
                  className="h-8"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addClient} className="flex-1">Add</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowNewClientForm(false);
                      setNewClientName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewClientForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            )}
          </div>

          {/* Client List */}
          <div className="flex-1 overflow-y-auto p-1 sm:p-2">
            <div className="space-y-2">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className={`p-2 sm:p-3 rounded-lg border transition-colors cursor-pointer ${activeClient === client.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-border'
                    }`}
                  onClick={() => setActiveClient(client.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs sm:text-sm truncate">{client.name}</h3>
                    </div>
                    {clients.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeClient(client.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground flex-shrink-0 ml-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Status Badge - Clickable */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 hover:bg-transparent"
                      >
                        <Badge
                          variant={getStatusBadgeVariant(client.status, activeClient === client.id)}
                          className="text-xs flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {client.status}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Setting status to Approved for client:', client.id);
                          updateClient(client.id, { status: 'Approved' });
                        }}
                      >
                        Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Setting status to Under review for client:', client.id);
                          updateClient(client.id, { status: 'Under review' });
                        }}
                      >
                        Under review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          console.log('Setting status to Rejected for client:', client.id);
                          updateClient(client.id, { status: 'Rejected' });
                        }}
                      >
                        Rejected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Client Workspace */}
        <div className="flex-1 overflow-hidden">
          {activeClientData && (
            <ClientContextProvider clientData={activeClientData} updateClient={updateClient}>
              <ClientWorkspace />
            </ClientContextProvider>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};