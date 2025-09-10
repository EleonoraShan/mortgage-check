import jsPDF from 'jspdf';
import { invoke } from '@tauri-apps/api/core';
import { useClientContext } from '../client-screen';
import { useToast } from '../ui/use-toast';


export const useExportAnalysisToPdf = () => {
  const { 
    name, 
    loanAmount, 
    depositAmount, 
    employmentStatus, 
    currentRole, 
    company, 
    propertyType, 
    analysisItems 
  } = useClientContext();
  const { toast } = useToast();

  const exportToPDF = async () => {
    const doc = new jsPDF('p', 'pt', 'a4', true)
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 50;
    const padding = 20;
    let yPosition = margin;

    // Helper function to get risk status color
    const getRiskColor = (riskStatus: string) => {
      switch (riskStatus) {
        case 'Low': return [34, 197, 94]; // Green
        case 'Medium': return [234, 179, 8]; // Yellow
        case 'High': return [239, 68, 68]; // Red
        default: return [107, 114, 128]; // Gray
      }
    };

    // Helper function to add a section header
    const addSectionHeader = (title: string, yPos: number) => {
      // Background rectangle
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(margin, yPos - 8, pageWidth - margin * 2, 30, 'F');
      
      // Title text with proper wrapping
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      
      // Split long titles to prevent cutoff
      const maxTitleWidth = pageWidth - margin * 2 - 30;
      const titleLines = doc.splitTextToSize(title, maxTitleWidth);
      doc.text(titleLines, margin + 15, yPos + 8);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      return yPos + 25 + (titleLines.length * 12);
    };

    // Helper function to add a card-style box
    const addCard = (content: string[], yPos: number, backgroundColor: number[] = [248, 250, 252]) => {
      const maxContentWidth = pageWidth - margin * 2 - padding * 2;
      let totalHeight = padding;
      
      // Calculate total height needed for all content
      content.forEach(line => {
        const wrappedLines = doc.splitTextToSize(line, maxContentWidth);
        totalHeight += wrappedLines.length * 14 + 5;
      });
      
      const cardHeight = totalHeight + padding;
      
      // Card background
      doc.setFillColor(...backgroundColor);
      doc.rect(margin, yPos, pageWidth - margin * 2, cardHeight, 'F');
      
      // Card border
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(1);
      doc.rect(margin, yPos, pageWidth - margin * 2, cardHeight, 'S');
      
      // Content with proper wrapping
      let currentY = yPos + padding + 10;
      content.forEach(line => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const wrappedLines = doc.splitTextToSize(line, maxContentWidth);
        doc.text(wrappedLines, margin + padding, currentY);
        currentY += wrappedLines.length * 14 + 5;
      });
      
      return yPos + cardHeight + padding;
    };

    // Header with logo area
    doc.setFillColor(15, 23, 42); // Dark blue background
    doc.rect(0, 0, pageWidth, 90, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Valora', margin, 40);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Mortgage Intelligence Report', margin, 60);
    
    doc.setTextColor(0, 0, 0);
    yPosition = 110;

    // Client Information Section
    yPosition = addSectionHeader('Client Information', yPosition);
    
    const clientInfo = [
      `Client Name: ${name}`,
      `Requested Loan Amount: £${loanAmount.toLocaleString()}`,
      `Deposit Amount: £${depositAmount.toLocaleString()}`,
      `Employment Status: ${employmentStatus === 'Select employment status' ? 'Not specified' : employmentStatus}`,
      ...(currentRole && currentRole !== 'Type information here' ? [`Current Role: ${currentRole}`] : []),
      ...(company && company !== 'Type information here' ? [`Company: ${company}`] : []),
      `Property Type: ${propertyType === 'Select property type' ? 'Not specified' : propertyType}`,
      `Report Generated: ${new Date().toLocaleDateString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`
    ];
    
    yPosition = addCard(clientInfo, yPosition);

    // Analysis Results Section
    yPosition = addSectionHeader('Document Analysis Results', yPosition);

    analysisItems.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 200) {
        doc.addPage();
        yPosition = margin;
      }

      // Risk status badge
      const riskColor = getRiskColor(item.risk_status);
      doc.setFillColor(...riskColor);
      doc.rect(margin, yPosition, 80, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(item.risk_status.toUpperCase(), margin + 5, yPosition + 13);
      
      doc.setTextColor(0, 0, 0);
      
      // Title with proper wrapping
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const titleText = `${index + 1}. ${item.title}`;
      const maxTitleWidth = pageWidth - margin * 2 - 100;
      const titleLines = doc.splitTextToSize(titleText, maxTitleWidth);
      doc.text(titleLines, margin + 90, yPosition + 13);
      yPosition += 25 + (titleLines.length * 12);

      // Description box with proper wrapping
      const maxDescWidth = pageWidth - margin * 2 - padding * 2;
      const descriptionLines = doc.splitTextToSize(item.explanation, maxDescWidth);
      const descriptionHeight = descriptionLines.length * 12 + padding * 2;
      
      doc.setFillColor(249, 250, 251);
      doc.rect(margin + padding, yPosition, pageWidth - margin * 2 - padding * 2, descriptionHeight, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin + padding, yPosition, pageWidth - margin * 2 - padding * 2, descriptionHeight, 'S');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(descriptionLines, margin + padding * 2, yPosition + padding + 8);
      
      yPosition += descriptionHeight + padding;
    });

    // Summary section
    if (yPosition > pageHeight - 200) {
      doc.addPage();
      yPosition = margin;
    }

    yPosition = addSectionHeader('Analysis Summary', yPosition);

    const successCount = analysisItems.filter(a => a.risk_status === 'Low').length;
    const mediumCount = analysisItems.filter(a => a.risk_status === 'Medium').length;
    const highCount = analysisItems.filter(a => a.risk_status === 'High').length;
    const uncertainCount = analysisItems.filter(a => a.risk_status === 'Insufficient Information').length;

    // Summary cards in a grid layout with proper spacing
    const cardWidth = (pageWidth - margin * 3) / 2;
    const cardHeight = 70;
    const cardSpacing = 15;
    
    // Low Risk Card
    doc.setFillColor(34, 197, 94);
    doc.rect(margin, yPosition, cardWidth, cardHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LOW RISK', margin + padding, yPosition + 20);
    doc.setFontSize(20);
    doc.text(successCount.toString(), margin + padding, yPosition + 50);
    
    // Medium Risk Card
    doc.setFillColor(234, 179, 8);
    doc.rect(margin + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDIUM RISK', margin + cardWidth + cardSpacing + padding, yPosition + 20);
    doc.setFontSize(20);
    doc.text(mediumCount.toString(), margin + cardWidth + cardSpacing + padding, yPosition + 50);
    
    yPosition += cardHeight + cardSpacing;
    
    // High Risk Card
    doc.setFillColor(239, 68, 68);
    doc.rect(margin, yPosition, cardWidth, cardHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('HIGH RISK', margin + padding, yPosition + 20);
    doc.setFontSize(20);
    doc.text(highCount.toString(), margin + padding, yPosition + 50);
    
    // Insufficient Info Card
    doc.setFillColor(107, 114, 128);
    doc.rect(margin + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INSUFFICIENT INFO', margin + cardWidth + cardSpacing + padding, yPosition + 20);
    doc.setFontSize(20);
    doc.text(uncertainCount.toString(), margin + cardWidth + cardSpacing + padding, yPosition + 50);

    yPosition += cardHeight + padding * 2;

    // Next Steps Section
    if (yPosition > pageHeight - 200) {
      doc.addPage();
      yPosition = margin;
    }

    yPosition = addSectionHeader('Recommended Next Steps', yPosition);

    // Generate next steps based on analysis
    const nextSteps = [];
    
    if (uncertainCount > 0) {
      nextSteps.push(`• Request additional documentation for ${uncertainCount} item(s) marked as "Insufficient Information"`);
    }
    
    if (highCount > 0) {
      nextSteps.push(`• Address ${highCount} high-risk finding(s) before proceeding with application`);
    }
    
    if (mediumCount > 0) {
      nextSteps.push(`• Review and potentially mitigate ${mediumCount} medium-risk finding(s)`);
    }
    
    if (successCount > 0) {
      nextSteps.push(`• ${successCount} positive finding(s) support the application`);
    }

    // Add standard next steps
    nextSteps.push('• Schedule follow-up meeting with client to discuss findings');
    nextSteps.push('• Prepare application package for lender submission');
    nextSteps.push('• Consider additional documentation if required by specific lender criteria');
    
    if (nextSteps.length === 0) {
      nextSteps.push('• No specific actions required based on current analysis');
    }

    yPosition = addCard(nextSteps, yPosition, [240, 248, 255]); // Light blue background

    // Footer
    const footerY = pageHeight - 30;
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Valora - Mortgage Intelligence Platform', margin, footerY);
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, pageWidth - margin - 50, footerY);

    // Generate PDF data
    const pdfData = doc.output('arraybuffer');
    const fileName = `${name.replace(/\s+/g, '_')}_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
    
    try {
      // Convert ArrayBuffer to Uint8Array for Tauri
      const pdfBytes = new Uint8Array(pdfData);
      
      // Use Tauri command to save the file
      const result = await invoke('save_pdf_file', {
        pdfData: Array.from(pdfBytes),
        suggestedFilename: fileName
      });
      
      toast({
        title: "PDF Exported Successfully",
        description: result as string,
      });
    } catch (error) {
      console.error('Failed to save PDF:', error);
      toast({
        title: "Export Failed",
        description: `Failed to save PDF: ${error}`,
        variant: "destructive"
      });
    }
  }

  return { exportToPDF }

};

