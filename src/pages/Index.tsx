import { ClientTabs, Header } from '../components';
import { ModelDownloading } from './model-downloading';

const Index = ({ isAppReady, isAppLoading }: { isAppReady: boolean, isAppLoading: boolean }) => {
  return (

    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {isAppLoading && <ModelDownloading />}
      {isAppReady && <main className="flex flex-1 overflow-hidden">
        <ClientTabs />
      </main>}
    </div>
  );
};

export default Index;