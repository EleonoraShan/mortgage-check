
export const SplashScreen = () => {
  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center p-6 absolute bottom-0 left-0 right-0 top-0 z-1000">
      <img
        src="/wordmark.png"
        alt="Lendomus"
        className="h-16 w-auto mx-auto"
      />
    </div>
  );
};
