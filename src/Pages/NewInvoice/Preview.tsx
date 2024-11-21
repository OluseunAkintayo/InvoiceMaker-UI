import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { IInvoiceFields, IInvoiceItem } from "@/lib/types";
import { Download, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";


interface IPreview {
  open: boolean;
  close: () => void;
  total: number;
  invoiceItems: Array<IInvoiceItem>;
  invoiceFields: IInvoiceFields;
}

function Preview({ open, close, invoiceFields, total, invoiceItems }: IPreview) {
  const pdfOptions: Options = {
    filename: "Invoice" + invoiceFields.invoiceNumber + ".pdf",
    method: "save",
    resolution: Resolution.NORMAL,
    page: {
      margin: Margin.MEDIUM,
      format: "A4",
      orientation: "portrait"
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1
    },
    overrides: {
      pdf: {
        compress: true
      },
      canvas: {
        useCORS: true
      }
    }
  }
  const getComponent = () => document.getElementById("invoice");
  const downloadPdf = () => generatePDF(getComponent, pdfOptions);

  // const [devicePixelRatio, setDevicPixelRatio] = React.useState(window.devicePixelRatio);
  // React.useEffect(() => {
  //   const handleResize = () => setDevicPixelRatio(window.devicePixelRatio || 1);
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);
  // const pdfRef: React.MutableRefObject<HTMLElement | undefined> = React.useRef();
  // const exportPdf = async () => {
  //   try {
  //     const html2canvas = (await import('html2canvas')).default;
  //     const { jsPDF } = await import('jspdf');
  //     const pdfElement = pdfRef.current;
  //     const A4_WIDTH = 595.28;
  //     const A4_HEIGHT = 841.89;
  //     const MARGIN = 10;
  //     const canvas = await html2canvas(pdfElement || document.createElement('canvas'), {
  //       scale: devicePixelRatio,
  //       useCORS: true,
  //       logging: true,
  //       allowTaint: true,
  //       backgroundColor: '#FFFFFF',
  //       windowHeight: pdfElement?.scrollHeight,
  //       windowWidth: pdfElement?.scrollWidth,
  //     });

  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'pt',
  //       format: 'a4'
  //     });

  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const pageWidth = A4_WIDTH - (MARGIN * 2);
  //     const pageHeight = A4_HEIGHT - (MARGIN * 2);

  //     let scale = 1;

  //     if (imgWidth > pageWidth || imgHeight > pageHeight) {
  //       const widthRatio = pageWidth / imgWidth;
  //       const heightRatio = pageHeight / imgHeight;
  //       scale = Math.min(widthRatio, heightRatio, 1);
  //     }

  //     const scaledWidth = imgWidth * scale;
  //     const scaledHeight = imgHeight * scale;

  //     const xPosition = (A4_WIDTH - scaledWidth) / 2;
  //     const yPosition = (A4_HEIGHT - scaledHeight) / 2;

  //     const imgData = canvas.toDataURL('image/png');
  //     pdf.addImage(
  //       imgData,
  //       'PNG',
  //       xPosition,
  //       yPosition,
  //       scaledWidth,
  //       scaledHeight,
  //       undefined,
  //       'FAST'
  //     );

  //     const addFooter = (doc) => {
  //       const pageCount = doc.internal.getNumberOfPages();
  //       for (let i = 1; i <= pageCount; i++) {
  //         doc.setPage(i);
  //         const footerText = `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()}`;
  //         doc.setFontSize(10);
  //         doc.setTextColor(100);

  //         doc.text(
  //           footerText,
  //           A4_WIDTH / 2,
  //           A4_HEIGHT - 20,
  //           { align: 'left' }
  //         );

  //         doc.setLineWidth(0.5);
  //         doc.line(
  //           MARGIN,
  //           A4_HEIGHT - 30,
  //           A4_WIDTH - MARGIN,
  //           A4_HEIGHT - 30
  //         );
  //       }
  //     };

  //     addFooter(pdf);
  //     pdf.save('invoice.pdf');
  //   } catch (error) {
  //     console.error({ error });
  //     alert("Error exporting invoice");
  //   }
  // }


  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent className='max-w-screen-xl overflow-x-auto'>
        <div className="mt-8">
          <div id="invoice"
            // ref={el => pdfRef.current = el as HTMLDivElement}
          >
            <div className="flex gap-4 justify-between">
              <div>
                <h3 className="text-5xl font-semibold mb-4 text-slate-700">Invoice</h3>
                <p>{invoiceFields.invoiceNumber}</p>
              </div>
              <div>
                <img src={invoiceFields.logo} alt="logo" className="rounded-md max-w-[144px]" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-4">
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-slate-700">Biller:</h3>
                <div>
                  <p className="text-sm">{invoiceFields.billerName}</p>
                  <p className="text-sm">{invoiceFields.billerAddress}</p>
                  <p className="text-sm">{invoiceFields.billerEmail}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-slate-700">Bill To:</h3>
                <div>
                  <p className="text-sm">{invoiceFields.customerName}</p>
                  <p className="text-sm">{invoiceFields.customerAddress}</p>
                  <p className="text-sm">{invoiceFields.customerEmail}</p>
                </div>
              </div>
              <div className="space-y-2 flex items-end">
                <div>
                  <p className="text-sm">Invoice Date: {new Date(invoiceFields.billDate).toLocaleDateString()}</p>
                  <p className="text-sm">Due Date: {new Date(invoiceFields.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">SN</TableHead>
                  <TableHead>Item Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  invoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="w-10">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.rate.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(item.quantity * item.rate).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <div className="flex border-t pt-6">
              <div className="flex-[2]" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-6 justify-between items-center">
                  <h3>Sub total</h3>
                  <p>{total.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex gap-6 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3>Tax ({invoiceFields.tax}%)</h3>
                  </div>
                  <p>{(total * invoiceFields.tax / 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex gap-6 justify-between items-center">
                  <h3>Discount</h3>
                  {invoiceFields.discount.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </div>
                <div className="flex gap-6 justify-between border-t pt-2 pb-4">
                  <h3 className="font-semibold">Total</h3>
                  <p>{((1 + invoiceFields.tax / 100) * total).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-2 w-full mt-6'>
          <Button onClick={downloadPdf}>
            <Download /> Download
          </Button>
          <Button variant={"destructive"} onClick={close}>
            <X />
            Cancel
          </Button>
        </div>
        <AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default Preview;
