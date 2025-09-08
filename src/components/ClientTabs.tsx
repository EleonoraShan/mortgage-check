import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ClientContextProvider } from './client-screen/client-provider';
import { ClientWorkspace } from './client-workspace/ClientWorkspace';



export const ClientTabs = () => {
  const [clients, setClients] = useState<ClientDataI[]>([
    { id: '1', name: 'John Smith', loanAmount: 350000 }
  ]);
  const [activeClient, setActiveClient] = useState('1');
  const [newClientName, setNewClientName] = useState('');
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  const addClient = () => {
    if (newClientName.trim()) {
      const newClient: ClientDataI = {
        id: Date.now().toString(),
        name: newClientName.trim(),
        loanAmount: 300000
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
    if (activeClient === clientId && updatedClients.length > 0) {
      setActiveClient(updatedClients[0].id);
    }
  };


  const activeClientData = clients.find(c => c.id === activeClient);

  return (
    <div className="flex flex-col h-[calc(100vh-81px)]">
      {/* Client Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex items-center px-6 py-2 gap-1">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center">
              <Button
                variant={activeClient === client.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveClient(client.id)}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {client.name}
              </Button>
              {clients.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClient(client.id)}
                  className="ml-1 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}

          {showNewClientForm ? (
            <div className="flex items-center gap-2 ml-2">
              <Input
                placeholder="Client name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addClient()}
                className="h-8 w-32"
                autoFocus
              />
              <Button size="sm" onClick={addClient}>Add</Button>
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
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewClientForm(true)}
              className="ml-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Client
            </Button>
          )}
        </div>
      </div>

      {/* Client Workspace */}
      {activeClientData && (
        <ClientContextProvider clientData={activeClientData}>
          <ClientWorkspace />
        </ClientContextProvider>
      )}
    </div>
  );
};