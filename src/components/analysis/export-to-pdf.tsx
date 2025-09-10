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
    const doc = new jsPDF('p', 'pt', 'a4', true);
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Modern color palette - muted tones
    const colors = {
      primary: [59, 130, 246], // Muted blue
      secondary: [107, 114, 128], // Muted gray
      success: [34, 197, 94], // Muted green
      warning: [234, 179, 8], // Muted yellow
      danger: [239, 68, 68], // Muted red
      info: [107, 114, 128], // Muted gray
      background: [248, 250, 252], // Light gray
      cardBackground: [255, 255, 255], // White
      border: [229, 231, 235], // Light border
      text: [31, 41, 55], // Dark gray text
      mutedText: [107, 114, 128] // Muted text
    };

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number = 8) => {
      doc.setLineWidth(1);
      doc.setDrawColor(...colors.border);
      doc.roundedRect(x, y, width, height, radius, radius, 'S');
    };

    // Helper function to fill rounded rectangle
    const fillRoundedRect = (x: number, y: number, width: number, height: number, fillColor: number[], radius: number = 8) => {
      doc.setFillColor(...fillColor);
      doc.roundedRect(x, y, width, height, radius, radius, 'F');
    };

    // Helper function to add centered text
    const addCenteredText = (text: string, x: number, y: number, fontSize: number, fontStyle: string = 'normal', color: number[] = colors.text) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      doc.setTextColor(...color);
      const textWidth = doc.getTextWidth(text);
      doc.text(text, x - (textWidth / 2), y);
    };

    // Helper function to add section header with rounded background
    const addSectionHeader = (title: string, yPos: number) => {
      const sectionHeaderHeight = 35;
      const radius = 8;
      
      // Rounded background
      fillRoundedRect(margin, yPos, contentWidth, sectionHeaderHeight, colors.primary, radius);
      
      // Centered title
      addCenteredText(title, margin + (contentWidth / 2), yPos + 22, 16, 'bold', [255, 255, 255]);
      
      return yPos + sectionHeaderHeight + 20;
    };

    // Helper function to add modern card
    const addModernCard = (content: string[], yPos: number, backgroundColor: number[] = colors.cardBackground) => {
      const cardPadding = 20;
      const maxContentWidth = contentWidth - (cardPadding * 2);
      let totalHeight = cardPadding;
      
      // Calculate total height needed
      content.forEach(line => {
        const wrappedLines = doc.splitTextToSize(line, maxContentWidth);
        totalHeight += wrappedLines.length * 14 + 8;
      });
      
      const cardHeight = totalHeight + cardPadding;
      
      // Card background with rounded corners
      fillRoundedRect(margin, yPos, contentWidth, cardHeight, backgroundColor, 8);
      drawRoundedRect(margin, yPos, contentWidth, cardHeight, 8);
      
      // Content with proper spacing
      let currentY = yPos + cardPadding + 12;
      content.forEach(line => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.text);
        const wrappedLines = doc.splitTextToSize(line, maxContentWidth);
        doc.text(wrappedLines, margin + cardPadding, currentY);
        currentY += wrappedLines.length * 14 + 8;
      });
      
      return yPos + cardHeight + 15;
    };

    // Helper function to get risk color
    const getRiskColor = (riskStatus: string) => {
      switch (riskStatus) {
        case 'Low': return colors.success;
        case 'Medium': return colors.warning;
        case 'High': return colors.danger;
        default: return colors.info;
      }
    };

    // Helper function to get risk items grouped by level
    const getRiskGroupedItems = () => {
      const grouped = {
        'Low': analysisItems.filter(item => item.risk_status === 'Low'),
        'Medium': analysisItems.filter(item => item.risk_status === 'Medium'),
        'High': analysisItems.filter(item => item.risk_status === 'High'),
        'Insufficient Information': analysisItems.filter(item => item.risk_status === 'Insufficient Information')
      };
      return grouped;
    };

    // Header with modern design
    fillRoundedRect(0, 0, pageWidth, 100, colors.primary, 0);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    addCenteredText('Valora', pageWidth / 2, 45, 28, 'bold', [255, 255, 255]);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    addCenteredText('Mortgage Intelligence Report', pageWidth / 2, 70, 14, 'normal', [255, 255, 255]);
    
    yPosition = 120;

    // 1. Client Information Section
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
    
    yPosition = addModernCard(clientInfo, yPosition);

    // 2. Model Summary Section
    yPosition = addSectionHeader('Executive Summary', yPosition);
    
    const riskGrouped = getRiskGroupedItems();
    const summaryPoints = [];
    
    if (riskGrouped['Low'].length > 0) {
      summaryPoints.push(`• ${riskGrouped['Low'].length} low-risk finding(s) identified - application shows positive indicators`);
    }
    
    if (riskGrouped['Medium'].length > 0) {
      summaryPoints.push(`• ${riskGrouped['Medium'].length} medium-risk finding(s) require attention and potential mitigation`);
    }
    
    if (riskGrouped['High'].length > 0) {
      summaryPoints.push(`• ${riskGrouped['High'].length} high-risk finding(s) need immediate resolution before proceeding`);
    }
    
    if (riskGrouped['Insufficient Information'].length > 0) {
      summaryPoints.push(`• ${riskGrouped['Insufficient Information'].length} item(s) require additional documentation for complete assessment`);
    }

    // Add next steps to summary
    if (riskGrouped['High'].length > 0) {
      summaryPoints.push(`• Immediate action required: Address high-risk findings before application submission`);
    }
    if (riskGrouped['Insufficient Information'].length > 0) {
      summaryPoints.push(`• Documentation needed: Request additional information for complete assessment`);
    }
    if (riskGrouped['Medium'].length > 0) {
      summaryPoints.push(`• Review recommended: Evaluate medium-risk items for potential mitigation strategies`);
    }
    if (riskGrouped['Low'].length > 0 && riskGrouped['High'].length === 0) {
      summaryPoints.push(`• Application ready: Positive indicators support proceeding with submission`);
    }
    
    yPosition = addModernCard(summaryPoints, yPosition, [240, 248, 255]);

    // 3. Analysis Statistics Cards
    yPosition = addSectionHeader('Risk Assessment Overview', yPosition);
    
    // Check if we have enough space for the header AND the statistics cards
    const cardWidth = (contentWidth - 20) / 2;
    const cardHeight = 80;
    const cardSpacing = 20;
    const riskAssessmentHeaderHeight = 35 + 20; // Section header height + margin
    const totalStatsHeight = riskAssessmentHeaderHeight + (cardHeight * 2) + cardSpacing + 30; // Header + two rows + spacing + margin
    
    if (yPosition + totalStatsHeight > pageHeight - 100) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Low Risk Card
    fillRoundedRect(margin, yPosition, cardWidth, cardHeight, colors.success, 8);
    addCenteredText('LOW RISK', margin + (cardWidth / 2), yPosition + 25, 12, 'bold', [255, 255, 255]);
    addCenteredText(riskGrouped['Low'].length.toString(), margin + (cardWidth / 2), yPosition + 55, 24, 'bold', [255, 255, 255]);
    
    // Medium Risk Card
    fillRoundedRect(margin + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, colors.warning, 8);
    addCenteredText('MEDIUM RISK', margin + cardWidth + cardSpacing + (cardWidth / 2), yPosition + 25, 12, 'bold', [0, 0, 0]);
    addCenteredText(riskGrouped['Medium'].length.toString(), margin + cardWidth + cardSpacing + (cardWidth / 2), yPosition + 55, 24, 'bold', [0, 0, 0]);
    
    yPosition += cardHeight + cardSpacing;
    
    // High Risk Card
    fillRoundedRect(margin, yPosition, cardWidth, cardHeight, colors.danger, 8);
    addCenteredText('HIGH RISK', margin + (cardWidth / 2), yPosition + 25, 12, 'bold', [255, 255, 255]);
    addCenteredText(riskGrouped['High'].length.toString(), margin + (cardWidth / 2), yPosition + 55, 24, 'bold', [255, 255, 255]);
    
    // Insufficient Info Card
    fillRoundedRect(margin + cardWidth + cardSpacing, yPosition, cardWidth, cardHeight, colors.info, 8);
    addCenteredText('INSUFFICIENT INFO', margin + cardWidth + cardSpacing + (cardWidth / 2), yPosition + 25, 12, 'bold', [255, 255, 255]);
    addCenteredText(riskGrouped['Insufficient Information'].length.toString(), margin + cardWidth + cardSpacing + (cardWidth / 2), yPosition + 55, 24, 'bold', [255, 255, 255]);

    yPosition += cardHeight + 30;

    // 4. Detailed Analysis by Risk Level
    // Check if we have enough space for the header
    const detailedAnalysisHeaderHeight = 35 + 20; // Section header height + margin
    if (yPosition + detailedAnalysisHeaderHeight > pageHeight - 100) {
      doc.addPage();
      yPosition = margin;
    }
    
    yPosition = addSectionHeader('Detailed Analysis', yPosition);

    // Process each risk level in order: Low, Medium, High, Insufficient Information
    const riskOrder = ['Low', 'Medium', 'High', 'Insufficient Information'];
    
    riskOrder.forEach(riskLevel => {
      const items = riskGrouped[riskLevel as keyof typeof riskGrouped];
      
      if (items.length > 0) {
        // Individual findings (no subheading, just process items directly)
        items.forEach((item, index) => {
          // Calculate card height first
          const cardPadding = 15;
          const maxContentWidth = contentWidth - (cardPadding * 2);
          
          // Calculate badge width based on text length
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          const badgeText = item.risk_status.toUpperCase();
          const badgeTextWidth = doc.getTextWidth(badgeText);
          const badgeWidth = Math.max(badgeTextWidth + 16, 100); // Add padding, minimum 100px
          const badgeHeight = 22;
          
          // Title
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          const titleText = `${index + 1}. ${item.title}`;
          const titleMaxWidth = maxContentWidth - badgeWidth - 15; // Leave space for badge
          const titleLines = doc.splitTextToSize(titleText, titleMaxWidth);
          const titleHeight = titleLines.length * 15;
          
          // Description
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const descriptionLines = doc.splitTextToSize(item.explanation, maxContentWidth);
          const descriptionHeight = descriptionLines.length * 13;
          
          const totalCardHeight = Math.max(titleHeight + descriptionHeight + (cardPadding * 2) + 10, badgeHeight + (cardPadding * 2));
          
          // Check if we need a new page for this card
          if (yPosition + totalCardHeight > pageHeight - 100) {
            doc.addPage();
            yPosition = margin;
          }

          // Card background
          fillRoundedRect(margin, yPosition, contentWidth, totalCardHeight, colors.cardBackground, 8);
          drawRoundedRect(margin, yPosition, contentWidth, totalCardHeight, 8);
          
          // Risk status badge (positioned on the right side)
          const riskColor = getRiskColor(item.risk_status);
          const badgeX = margin + contentWidth - cardPadding - badgeWidth;
          fillRoundedRect(badgeX, yPosition + cardPadding, badgeWidth, badgeHeight, riskColor, 4);
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(badgeText, badgeX + (badgeWidth / 2), yPosition + cardPadding + 14, { align: 'center' });
          
          // Title (positioned on the left, with space for badge)
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...colors.text);
          doc.text(titleLines, margin + cardPadding, yPosition + cardPadding + 12);
          
          // Description
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...colors.mutedText);
          doc.text(descriptionLines, margin + cardPadding, yPosition + cardPadding + titleHeight + 20);
          
          yPosition += totalCardHeight + 15;
        });
      }
    });

    // Footer
    const footerY = pageHeight - 30;
    doc.setTextColor(...colors.mutedText);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    addCenteredText('Generated by Valora - Mortgage Intelligence Platform', pageWidth / 2, footerY, 10, 'normal', colors.mutedText);
    
    // Page numbers
    const pageInfo = doc.getCurrentPageInfo();
    doc.text(`Page ${pageInfo.pageNumber}`, pageWidth - margin - 30, footerY);

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