import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (scan) => {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(6, 13, 24);
  doc.rect(0, 0, pageW, 40, 'F');
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SECURESCAN AI', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('Web Application Security Report', 14, 28);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);

  // Target info
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Scan Summary', 14, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Target: ${scan.url}`, 14, 65);
  doc.text(`Domain: ${scan.domain || 'N/A'}`, 14, 72);
  doc.text(`Security Score: ${scan.securityScore}/100 (Grade: ${scan.grade})`, 14, 79);
  doc.text(`Scan Date: ${new Date(scan.createdAt).toLocaleString()}`, 14, 86);

  // Score color
  const scoreColor = scan.securityScore >= 80 ? [16, 185, 129] : scan.securityScore >= 60 ? [234, 179, 8] : [239, 68, 68];
  doc.setFillColor(...scoreColor);
  doc.roundedRect(pageW - 50, 50, 36, 30, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(scan.grade, pageW - 35, 62, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`${scan.securityScore}/100`, pageW - 35, 72, { align: 'center' });

  // Summary counts
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Vulnerability Summary', 14, 100);

  const summaryData = Object.entries(scan.summary || {})
    .filter(([, v]) => v > 0)
    .map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v.toString()]);

  if (summaryData.length > 0) {
    autoTable(doc, {
      startY: 105,
      head: [['Severity', 'Count']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [6, 13, 24], textColor: [20, 184, 166], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30 } },
      margin: { left: 14 },
      tableWidth: 100
    });
  }

  // Vulnerabilities
  const vulnY = doc.lastAutoTable?.finalY + 15 || 140;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Detected Vulnerabilities', 14, vulnY);

  if (scan.vulnerabilities?.length > 0) {
    autoTable(doc, {
      startY: vulnY + 5,
      head: [['Severity', 'Type', 'Title', 'Status']],
      body: scan.vulnerabilities.map(v => [
        v.severity?.toUpperCase() || '',
        v.type || '',
        v.title || '',
        v.status || ''
      ]),
      theme: 'striped',
      headStyles: { fillColor: [6, 13, 24], textColor: [20, 184, 166], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });
  }

  // Recommendations
  if (scan.recommendations?.length > 0) {
    const recY = doc.lastAutoTable?.finalY + 15 || vulnY + 40;
    if (recY > 250) doc.addPage();
    const y = recY > 250 ? 20 : recY;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('AI Security Recommendations', 14, y);

    let lineY = y + 10;
    scan.recommendations.forEach((rec, i) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, pageW - 28);
      doc.text(lines, 14, lineY);
      lineY += lines.length * 5 + 3;
    });
  }

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('SecureScan AI — Confidential Security Report', 14, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} of ${pages}`, pageW - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }

  doc.save(`securescan-${scan.domain || 'report'}-${Date.now()}.pdf`);
};
