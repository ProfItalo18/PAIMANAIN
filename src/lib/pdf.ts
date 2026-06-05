export async function exportElementToPdf(elementId: string, filename: string) {
  const html2pdf = (await import('html2pdf.js')).default;
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Elemento do PAI não encontrado para exportação.');

  return html2pdf()
    .set({
      margin: [5, 5, 5, 5],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 1.8,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', compress: true },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: ['.disciplina-bloco', '.pai-section', '.avoid-page-break', '.objetivo-grid']
      }
    })
    .from(element)
    .save();
}
