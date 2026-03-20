import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, UserProfile } from '../types';

const generateInvoicePage = (doc: jsPDF, order: Order, user: UserProfile, copyType: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightAlignX = pageWidth - 20;

  // Header - Left Side (Logo)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(190, 30, 45); // Red color for KWALITY
  doc.text('KWALITY', 20, 25);
  const kwalityHeaderWidth = doc.getTextWidth('KWALITY');
  doc.setFontSize(10);
  doc.text('®', 20 + kwalityHeaderWidth + 1, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Black color for DRY CLEANERS
  doc.text('DRY CLEANERS', 20, 33);

  // Copy Label
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text(copyType, pageWidth - 20, 10, { align: 'right' });

  // Header - Right Side (Address & Contact)
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('25, CENTRAL MARKET, ASHOK VIHAR,', rightAlignX, 15, { align: 'right' });
  doc.text('(BEHIND TAXI STAND), DELHI-110052', rightAlignX, 20, { align: 'right' });
  
  doc.setTextColor(190, 30, 45); // Red for phone and timings
  doc.text('PHONE : 011-43686275,', rightAlignX, 26, { align: 'right' });
  doc.text('9582225129, 9899007227', rightAlignX, 30, { align: 'right' });
  doc.text('STORE TIMINGS 10 AM - 8 PM.', rightAlignX, 35, { align: 'right' });
  doc.text('(MONDAY CLOSED)', rightAlignX, 40, { align: 'right' });

  // Tax Invoice Line
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 45, pageWidth - 20, 45);
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE GSTIN : 07BJUPS6833D1ZO', pageWidth / 2, 50, { align: 'center' });
  doc.line(20, 52, pageWidth - 20, 52);

  // Order Info Row
  doc.setFontSize(10);
  doc.text(order.id, 20, 60);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const orderDate = new Date(order.date);
  const formattedDate = orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  doc.text(formattedDate, 45, 58);
  doc.text(formattedTime, 45, 63);
  
  // Barcode Placeholder removed as per user request
  
  // Customer Info (Right)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(user.name, rightAlignX, 58, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(user.address || 'Place of Supply - Delhi', rightAlignX, 63, { align: 'right', maxWidth: 50 });

  doc.line(20, 70, pageWidth - 20, 70);

  // Financial Summary Row
  doc.setFontSize(9);
  doc.text(`INR : ${order.total.toFixed(2)}`, 30, 77);
  doc.text('Current Due', 30, 82);
  
  doc.setFontSize(14);
  doc.text('-', pageWidth / 3 + 10, 79);
  
  doc.setFontSize(9);
  doc.text('INR : 0.00', pageWidth / 2 - 10, 77);
  doc.text('Advance', pageWidth / 2 - 10, 82);
  
  doc.setFontSize(14);
  doc.text('=', pageWidth * 2/3 - 10, 79);
  
  doc.setFontSize(9);
  doc.text(`INR : ${order.total.toFixed(2)}`, rightAlignX - 20, 77, { align: 'right' });
  doc.text('Balance Due', rightAlignX - 20, 82, { align: 'right' });

  doc.line(20, 85, pageWidth - 20, 85);

  // Table Header Info
  doc.setFontSize(8);
  const totalPcs = order.items.reduce((acc, item) => acc + item.quantity, 0);
  doc.text(`Total Pcs : ${totalPcs}`, 20, 92);
  doc.text('Advance Balance : 0', 60, 92);
  
  const dueDate = new Date(order.pickupDate);
  const formattedDueDate = dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const dayName = dueDate.toLocaleDateString('en-IN', { weekday: 'long' });
  doc.text(`Due Date : ${formattedDueDate} 7:00 PM / ${dayName}`, rightAlignX, 92, { align: 'right' });

  // Items Table
  const tableData = order.items.map((item, index) => [
    (index + 1).toString(),
    item.name,
    item.quantity.toString(),
    item.price.toFixed(2),
    (item.price * item.quantity).toFixed(2)
  ]);

  autoTable(doc, {
    startY: 95,
    head: [['S.No', 'Particulars', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fontStyle: 'bold', lineWidth: 0.1, lineColor: 0 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  doc.line(20, finalY + 2, pageWidth - 20, finalY + 2);

  // Footer
  doc.setFontSize(7);
  doc.text('Terms and Conditions', 20, finalY + 8);
  doc.text('1. Not Eligible to collect tax on supplies', 20, finalY + 13);
  doc.text('2. Expensive Garments should be given separately to the counter man', 20, finalY + 18);
  doc.text('3. Shop Timing 10AM-8PM (Monday Closed)', 20, finalY + 23);
  
  doc.setFont('helvetica', 'bold');
  doc.text('QUALITY IS OUR MOTTO', 20, finalY + 28);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Booked By : ${order.userName.split(' ')[0].toLowerCase()}`, pageWidth / 2, finalY + 8, { align: 'center' });
  doc.text(`Payment Mode : ${order.paymentMethod}`, pageWidth / 2, finalY + 13, { align: 'center' });

  doc.text('Subtotal', rightAlignX - 40, finalY + 8);
  doc.text(order.total.toFixed(2), rightAlignX, finalY + 8, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text('Current Due', rightAlignX - 40, finalY + 18);
  doc.text(order.total.toFixed(2), rightAlignX, finalY + 18, { align: 'right' });

  doc.setFontSize(8);
  const fullSigText = 'For KWALITY DRY CLEANERS';
  const fullWidth = doc.getTextWidth(fullSigText);
  const startX = rightAlignX - fullWidth;
  
  doc.setTextColor(0, 0, 0);
  doc.text('For ', startX, finalY + 35);
  const forWidth = doc.getTextWidth('For ');
  
  doc.setTextColor(190, 30, 45);
  doc.text('KWALITY', startX + forWidth, finalY + 35);
  const kwalitySigWidth = doc.getTextWidth('KWALITY');
  doc.setFontSize(4);
  doc.text('®', startX + forWidth + kwalitySigWidth + 0.5, finalY + 33);
  
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(' DRY CLEANERS', startX + forWidth + kwalitySigWidth + 2, finalY + 35);

  doc.text('Authorised Signatory', rightAlignX, finalY + 45, { align: 'right' });
};

export const downloadInvoice = (order: Order, user: UserProfile) => {
  const doc = new jsPDF();
  
  // Single Page: Customer Copy
  generateInvoicePage(doc, order, user, 'CUSTOMER COPY');
  
  doc.save(`Invoice_${order.id}.pdf`);
};
