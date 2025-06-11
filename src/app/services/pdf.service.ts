// daily-report-pdf.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class DailyReportPdfService {

  generateDailyReport(data: any): void {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = 30;

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(data.companyName || 'COMPANY NAME', margin, yPos);
    yPos += 8;

    doc.setFontSize(14);
    doc.text(data.companyTagline || 'COMPANY TAGLINE', margin, yPos);
    yPos += 10;

    doc.setFontSize(16);
    doc.text('RELATÓRIO DIÁRIO DE OBRA', margin, yPos);
    yPos += 15;

    // Horizontal line after header
    this.drawHorizontalLine(doc, yPos);
    yPos += 10;

    // --- Company Info ---
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const companyInfo = [
      data.companyFullName || 'COMPANY FULL NAME LTDA',
      `CNPJ: ${data.cnpj || 'XX.XXX.XXX/XXXX-XX'}`,
      data.companyAddress || 'ADDRESS, NUMBER - COMPLEMENT',
      `CEP: ${data.cep || 'XXXXX-XXX'} - ${data.city || 'CITY'} - ${data.state || 'STATE'}`
    ];

    companyInfo.forEach(line => {
      doc.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 10;

    // Horizontal line after company info
    this.drawHorizontalLine(doc, yPos);
    yPos += 10;

    // --- Client Data ---
    doc.setFontSize(11);
    doc.text(`Cliente: ${data.client || ''}`, margin, yPos);
    doc.text(`Local: ${data.location || ''}`, margin + 90, yPos);
    yPos += 10;

    doc.text(`Nº Contrato: ${data.contractNumber || ''}`, margin, yPos);
    doc.text(`Data: ${data.date || ''}`, margin + 90, yPos);
    yPos += 15;

    // Horizontal line after client data
    this.drawHorizontalLine(doc, yPos);
    yPos += 10;

    // --- Sections ---
    const sections = [
      { title: 'DESCRIÇÃO DOS SERVIÇOS/OCORRÊNCIAS', content: data.servicesDescription },
      { title: 'OCORRÊNCIAS CLIMÁTICAS', content: data.weatherConditions },
      { title: 'OBSERVAÇÕES DO CLIENTE', content: data.clientObservations },
      { title: 'EQUIPE ENVOLVIDA', content: data.teamInvolved }
    ];

    sections.forEach(section => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(section.title, margin, yPos);
      yPos += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(section.content || '', 170);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 5) + 10;

      // Horizontal line after each section
      this.drawHorizontalLine(doc, yPos);
      yPos += 10;
    });

    // --- Time Table ---
    const tableOptions: UserOptions = {
      startY: yPos,
      head: [['', 'INÍCIO', 'SAÍDA']],
      body: [
        ['Manhã:', data.morning?.start || '', data.morning?.end || ''],
        ['Tarde:', data.afternoon?.start || '', data.afternoon?.end || ''],
        ['Noite:', data.night?.start || '', data.night?.end || '']
      ],
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.5
      },
      styles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: 'bold' },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 }
      },
      margin: { left: margin }
    };

    autoTable(doc, tableOptions);

    // --- Signatures ---
    const finalY = (doc as any).lastAutoTable.finalY + 20;

    // First signature line
    this.drawHorizontalLine(doc, finalY, 60);
    this.drawHorizontalLine(doc, finalY, 60, 150);
    doc.text('Assinatura do Coordenador da Obra', margin, finalY + 10);
    doc.text('Assinatura do Gestor de Service', margin + 90, finalY + 10);

    // Second signature line (wider)
    this.drawHorizontalLine(doc, finalY + 25);
    doc.text('Carimbo e Assinatura do Gestor do Contrato (quando requerido)', 105, finalY + 35, { align: 'center' });

    // Save the PDF
    doc.save(`${data.companyName || 'REPORT'} - RELATÓRIO DIÁRIO DE OBRA.pdf`);
  }

  private drawHorizontalLine(doc: jsPDF, y: number, x1: number = 20, x2: number = 190) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(x1, y, x2, y);
  }
}
