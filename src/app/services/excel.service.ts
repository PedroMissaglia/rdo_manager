import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportRelatorioToExcel(data: any[], fileName: string): void {
    const excelData = this.prepareRelatorioData(data);
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);
    this.applyWorksheetFormatting(worksheet);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Relatório': worksheet },
      SheetNames: ['Relatório']
    };
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  private prepareRelatorioData(data: any[]): any[][] {
    const headers = [
      'CLIENTE', 'PLACA', 'DATA', 'H. PREV', 'H REAL',
      'JUSTIFICATIVA', 'AÇÕES', 'PRAZO', 'RESPONSÁVEL', 'STATUS'
    ];

    const rows = [headers];

    data.forEach(item => {
      // Linha de total do cliente
      rows.push([
        item.displayNameCliente,
        'Total',
        '',
        this.formatHourDecimal(item.horasPrevistasTotal),
        this.formatHourDecimal(item.horasRealizadasTotal),
        '',
        '',
        '',
        '',
        item.status || ''
      ]);

      // Agrupar relatórios por placa
      const reportsByPlaca = this.groupBy(item.dailyReport, 'placa');

      Object.keys(reportsByPlaca).forEach(placa => {
        const reports = reportsByPlaca[placa];

        // Calcular totais por placa
        const totalPlaca = reports.reduce((acc, report) => {
          acc.previstas += this.timeToMinutes(report.horasPrevistas || '00:00');
          acc.realizadas += this.timeToMinutes(report.horasRealizadas || '00:00');
          return acc;
        }, { previstas: 0, realizadas: 0 });

        // Linha de total da placa
        rows.push([
          '',
          placa,
          'Total',
          this.minutesToDecimal(totalPlaca.previstas),
          this.minutesToDecimal(totalPlaca.realizadas),
          '',
          '',
          '',
          '',
          ''
        ]);

        // Linhas detalhadas por data
        reports.forEach(report => {
          rows.push([
            '', // Espaço vazio para cliente
            '', // Espaço vazio para placa
            report.dataInicioDisplay || '',
            this.formatHourDecimal(report.horasPrevistas),
            this.formatHourDecimal(report.horasRealizadas),
            report.justificativa || '',
            report.acoes || '',
            '', // PRAZO
            report.responsavel || '',
            this.translateStatus(report.status) || ''
          ]);
        });
      });
    });

    return rows;
  }

  private groupBy(array: any[], key: string): { [key: string]: any[] } {
    return array.reduce((result, currentValue) => {
      const groupKey = currentValue[key] || 'Sem Placa';
      (result[groupKey] = result[groupKey] || []).push(currentValue);
      return result;
    }, {});
  }


  private translateStatus(status: string): string {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'finished':
        return 'Finalizado';
      case 'started':
        return 'Em andamento';
      default:
        return status;
    }
  }

  private applyWorksheetFormatting(worksheet: XLSX.WorkSheet): void {
    worksheet['!cols'] = worksheet['!cols'] || [];

    // Ajuste das larguras das colunas para o novo formato
    const colWidths = [20, 15, 8, 12, 10, 10, 30, 20, 12, 20, 15];
    colWidths.forEach((width, i) => {
      worksheet['!cols']![i] = { width };
    });

    // Congelar cabeçalho
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2' };

    // Adicionar bordas para melhor visualização (opcional)
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = worksheet[XLSX.utils.encode_cell({r:R,c:C})];
        if (!cell) continue;
        cell.s = cell.s || {};
        cell.s.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }
  }

  private formatHourDecimal(timeStr: string): string {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const decimal = minutes / 60;
    return (hours + decimal).toFixed(2).replace('.', ',');
  }

  private minutesToDecimal(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const decimal = minutes / 60;
    return (hours + decimal).toFixed(2).replace('.', ',');
  }

  private timeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
