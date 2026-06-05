'use client';
import { Button } from '@/components/ui/Button';
import { exportElementToPdf } from '@/lib/pdf';
export function PaiPrint({ filename }: { filename: string }) { return <div className="no-print mb-4 flex gap-2"><Button onClick={() => window.print()}>Imprimir</Button><Button className="bg-paiGreen" onClick={() => exportElementToPdf('pai-document', filename)}>Exportar PDF</Button></div>; }
