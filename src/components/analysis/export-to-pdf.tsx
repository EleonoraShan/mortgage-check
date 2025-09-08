import jsPDF from 'jspdf';
import { useClientContext } from '../client-screen';


export const useExportAnalysisToPdf = () => {
  const { name, loanAmount, analysisItems } = useClientContext();

  const exportToPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4', true)
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
    doc.text(`Requested Loan Amount: £${loanAmount.toLocaleString()}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
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
      doc.text(`Rating: ${item.risk_status.toUpperCase()}`, margin + 10, yPosition);
      yPosition += 6;

      // Wrap long text
      const splitDescription = doc.splitTextToSize(item.explanation, pageWidth - margin * 2 - 10);
      doc.text(splitDescription, margin + 10, yPosition);
      yPosition += splitDescription.length * 6;

      // doc.text(`Source: ${item.document}`, margin + 10, yPosition);
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
    const successCount = analysisItems.filter(a => a.risk_status === 'Low').length;
    const mediumCount = analysisItems.filter(a => a.risk_status === 'Medium').length;
    const highCount = analysisItems.filter(a => a.risk_status === 'High').length;
    const uncertainCount = analysisItems.filter(a => a.risk_status === 'Insufficient Information').length;

    doc.text(`Total Items Analyzed: ${analysisItems.length}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Positive Findings: ${successCount}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Medium Risk Finding : ${mediumCount}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Concerning Finding: ${highCount}`, margin, yPosition);
    yPosition += 8;
    doc.text(`Insuffiecient Information: ${uncertainCount}`, margin, yPosition);

    // Save the PDF
    const fileName = `${name.replace(/\s+/g, '_')}_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

  }

  return { exportToPDF }

};

