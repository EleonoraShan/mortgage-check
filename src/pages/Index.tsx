import { useState } from 'react';
import { ClientTabs, Header, WelcomeScreen } from '../components';
import { ModelDownloading } from './model-downloading';

const Index = ({ isAppReady, isAppLoading }: { isAppReady: boolean, isAppLoading: boolean }) => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  
  console.log('Index render - isAppReady:', isAppReady, 'isAppLoading:', isAppLoading, 'hasSeenWelcome:', hasSeenWelcome)
  
  const handleStartApp = () => {
    setHasSeenWelcome(true);
  };
  
  // Show welcome screen first
  if (isAppReady && !hasSeenWelcome) {
    return <WelcomeScreen onStart={handleStartApp} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <Header />
      {isAppLoading && <ModelDownloading />}
      {isAppReady && hasSeenWelcome && (
        <>
          <main className="flex flex-1 w-full">
            <ClientTabs />
          </main>
        </>
      )}
      {!isAppReady && !isAppLoading && (
        <div className="flex-1 flex items-center justify-center">
          <p>App not ready yet...</p>
        </div>
      )}
    </div>
  );
};

export default Index;