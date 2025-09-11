import { useEffect, useState } from 'react';
import { ClientTabs, Header, WelcomeScreen } from '../components';
import { loadWelcomeSeenFromStorage, saveWelcomeSeenToStorage } from '../lib/persistence';
import { ModelDownloading } from './model-downloading';

const Index = ({ isAppReady, isAppLoading }: { isAppReady: boolean, isAppLoading: boolean }) => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    // Initialize from storage once on mount
    const seen = loadWelcomeSeenFromStorage();
    if (seen) {
      setHasSeenWelcome(true);
    }
  }, []);

  console.log('Index render - isAppReady:', isAppReady, 'isAppLoading:', isAppLoading, 'hasSeenWelcome:', hasSeenWelcome)

  const handleStartApp = () => {
    saveWelcomeSeenToStorage();
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
    </div>
  );
};

export default Index;