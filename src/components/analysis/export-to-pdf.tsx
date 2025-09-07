import jsPDF from 'jspdf';
import { useClientContext } from '../client-screen';


export const useExportAnalysisToPdf = () => {
  const { name, loanAmount, analysisItems, affordabilityScore } = useClientContext();

  const exportToPDF = () => {
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
    doc.text(`Client: ${name}`, margin, yPosition);
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

    analysisItems.forEach((item, index) => {
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
    const successCount = analysisItems.filter(a => a.type === 'success').length;
    const concernCount = analysisItems.filter(a => a.type === 'concern').length;
    const warningCount = analysisItems.filter(a => a.type === 'warning').length;

    doc.text(`Total Items Analyzed: ${analysisItems.length}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Positive Findings: ${successCount}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Concerns: ${concernCount}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Warnings: ${warningCount}`, margin, yPosition);

    // Save the PDF
    const fileName = `${name.replace(/\s+/g, '_')}_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

  }

  return { exportToPDF }

};

