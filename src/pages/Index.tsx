import { ClientTabs, Header } from '../components';

const Index = () => {
  return (

    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <ClientTabs />
      </main>
    </div>
  );
};

export default Index;