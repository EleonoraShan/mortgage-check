import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 sm:p-12">
          <div className="text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <img
                src="/wordmark.png"
                alt="Lendomus"
                className="h-16 w-auto mx-auto"
              />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Welcome to Lendomus
              </h1>
            </div>

            {/* Main Description */}
            <div className="space-y-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              <p>
                Lendomus helps mortgage brokers speed up client document checks.
              </p>

              <p>
                Enter key client details like loan requirements and personal information,
                then upload their documents — including ID, proof of address, income verification,
                and bank statements.
              </p>

              <p>
                Lendomus will analyze the documents, highlight strengths, flag weaknesses,
                and show any missing information in the loan application. You can export
                the results as a PDF to share with your client.
              </p>

              <p>
                Manage multiple clients in your Lendomus dashboard. All data stays safe and
                confidential — the app runs locally, and nothing is sent to the cloud.
              </p>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <Button
                onClick={onStart}
                size="lg"
                className="px-8 py-3 text-lg font-semibold"
              >
                Start Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
