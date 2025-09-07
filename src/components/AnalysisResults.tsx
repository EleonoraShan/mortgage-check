import jsPDF from 'jspdf';
import { AlertTriangle, CheckCircle, Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { useToast } from '../hooks/use-toast';

interface AnalysisResultsProps {
  documents: File[];
  loanAmount: number;
  clientName: string;
}

interface AnalysisItem {
  type: 'concern' | 'success' | 'warning';
  title: string;
  description: string;
  document: string;
}

export const AnalysisResults = ({ documents, loanAmount, clientName }: AnalysisResultsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(documents.length > 0);
  const { toast } = useToast();

  // Mock analysis data - in real app this would come from document analysis
  const mockAnalysis: AnalysisItem[] = [
    {
      type: 'success',
      title: 'Income Verification Complete',
      description: 'Pay stubs show consistent monthly income of $8,500',
      document: 'paystub_march_2024.pdf'
    },
    {
      type: 'concern',
      title: 'Credit Score Below Threshold',
      description: 'Credit score of 640 is below preferred 680 threshold',
      document: 'credit_report.pdf'
    },
    {
      type: 'warning',
      title: 'High Debt-to-Income Ratio',
      description: 'Current DTI of 42% is above recommended 36%',
      document: 'bank_statement.pdf'
    },
    {
      type: 'success',
      title: 'Employment History Verified',
      description: '3+ years consistent employment with current employer',
      document: 'employment_letter.pdf'
    }
  ];

  const affordabilityScore = Math.max(0, Math.min(100,
    85 - (loanAmount > 400000 ? 20 : 0) - (mockAnalysis.filter(a => a.type === 'concern').length * 10)
  ));

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete",
        description: "Document analysis has been completed successfully",
      });
    }, 2000);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let yPosition = margin;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Mortgage Analysis Report', margin, yPosition);
      yPosition += 15;

      // Client Information
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Client: ${clientName}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Requested Loan Amount: $${loanAmount.toLocaleString()}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;

      // Affordability Score Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Affordability Assessment', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Affordability Score: ${affordabilityScore}%`, margin, yPosition);
      yPosition += 8;

      const affordabilityText = affordabilityScore >= 70
        ? 'Client appears to be able to afford this loan amount'
        : affordabilityScore >= 50
          ? 'Client may face challenges with this loan amount'
          : 'Client likely cannot afford this loan amount';

      doc.text(`Assessment: ${affordabilityText}`, margin, yPosition);
      yPosition += 15;

      // Analysis Results Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Document Analysis Results', margin, yPosition);
      yPosition += 10;

      mockAnalysis.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${item.title}`, margin, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'normal');
        doc.text(`Type: ${item.type.toUpperCase()}`, margin + 10, yPosition);
        yPosition += 6;

        // Wrap long text
        const splitDescription = doc.splitTextToSize(item.description, pageWidth - margin * 2 - 10);
        doc.text(splitDescription, margin + 10, yPosition);
        yPosition += splitDescription.length * 6;

        doc.text(`Source: ${item.document}`, margin + 10, yPosition);
        yPosition += 12;
      });

      // Summary section
      if (yPosition > 220) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const successCount = mockAnalysis.filter(a => a.type === 'success').length;
      const concernCount = mockAnalysis.filter(a => a.type === 'concern').length;
      const warningCount = mockAnalysis.filter(a => a.type === 'warning').length;

      doc.text(`Total Items Analyzed: ${mockAnalysis.length}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Positive Findings: ${successCount}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Concerns: ${concernCount}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Warnings: ${warningCount}`, margin, yPosition);

      // Save the PDF
      const fileName = `${clientName.replace(/\s+/g, '_')}_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Exported Successfully",
        description: `Analysis report saved as ${fileName}`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF report",
        variant: "destructive",
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'concern':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'concern':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Analysis Results</h3>
        <div className="flex gap-2">
          <Button
            onClick={runAnalysis}
            disabled={isAnalyzing || documents.length === 0}
            size="sm"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Analyze
          </Button>
          <Button
            onClick={exportToPDF}
            disabled={!analysisComplete}
            size="sm"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No documents selected for analysis</p>
          <p className="text-sm">Select documents to begin analysis</p>
        </div>
      ) : isAnalyzing ? (
        <div className="space-y-4">
          <div className="text-center py-4">
            <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing documents...</p>
          </div>
          <Progress value={45} className="w-full" />
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-6">
            {/* Affordability Score */}
            <div className="p-4 bg-accent rounded-lg">
              <h4 className="font-semibold mb-2">Affordability Assessment</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Loan Amount: ${loanAmount.toLocaleString()}</span>
                    <span className={affordabilityScore >= 70 ? 'text-success' : affordabilityScore >= 50 ? 'text-warning' : 'text-destructive'}>
                      {affordabilityScore}%
                    </span>
                  </div>
                  <Progress value={affordabilityScore} className="h-2" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {affordabilityScore >= 70
                  ? 'Client appears to be able to afford this loan amount'
                  : affordabilityScore >= 50
                    ? 'Client may face challenges with this loan amount'
                    : 'Client likely cannot afford this loan amount'
                }
              </p>
            </div>

            {/* Analysis Items */}
            <div className="space-y-3">
              <h4 className="font-semibold">Document Analysis</h4>
              {mockAnalysis.map((item, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start gap-3">
                    {getIcon(item.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{item.title}</h5>
                        <Badge variant={getBadgeVariant(item.type) as any}>
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <p className="text-xs text-muted-foreground">Source: {item.document}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};