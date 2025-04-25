// pdf.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generateDailyReport(data: any): void {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = 30;

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SWL', margin, yPos);
    yPos += 8;

    doc.setFontSize(14);
    doc.text('Tecnologia em Saneamento e Limpeza', margin, yPos);
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
      'SWL TECNOLOGIA EM LIMPEZA, SANEAMENTO E CONSTRUÇÃO LTDA',
      'CNPJ: 24.337.551/0001-03',
      'ROD BR 101, Nº 8025 - BOX 02',
      'CEP: 88.312-501 - SÃO VICENTE - ITAJAL - SC'
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
        fillColor: [255, 255, 255], // White background for header
        textColor: [0, 0, 0],       // Black text
        lineWidth: 0.5               // Border width
      },
      styles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0]         // Black borders
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 }
      },
      margin: { left: margin }
    };

    autoTable(doc, tableOptions);

    // --- Signatures ---
    const finalY = (doc as any).lastAutoTable.finalY + 20;

    // Signature lines
    this.drawHorizontalLine(doc, finalY);
    doc.text('Assinatura do Coordenador da Obra', margin, finalY + 10);
    doc.text('Assinatura do Gestor de Service', margin + 90, finalY + 10);

    this.drawHorizontalLine(doc, finalY + 25);
    doc.text('Carimbo e Assinatura do Gestor do Contrato (quando requerido)', 105, finalY + 35, { align: 'center' });

    doc.save('SWL - RELATÓRIO DIÁRIO DE OBRA.pdf');
  }

  private drawHorizontalLine(doc: jsPDF, y: number) {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
  }
}
