import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

interface PdfLivePreviewProps {
  blob: Blob | null;
}

export const PdfLivePreview: React.FC<PdfLivePreviewProps> = ({ blob }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPdf = async () => {
      if (!blob || !containerRef.current) return;
      try {
        setLoading(true);
        const arrayBuffer = await blob.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        if (!isMounted) return;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
      } catch (err) {
        console.error("Error loading PDF:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadPdf();
    return () => { isMounted = false; };
  }, [blob]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex flex-col items-center p-8 bg-slate-200 dark:bg-slate-900" 
      style={{ height: '100%', overflowY: 'auto' }}
    >
      {loading && blob && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 backdrop-blur-sm z-10">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!blob ? (
        <div className="text-slate-500 my-auto">Generating Preview...</div>
      ) : (
        <div className="flex flex-col gap-8 w-full max-w-4xl items-center pb-20">
          {Array.from({ length: numPages }, (_, i) => (
            <PdfPage key={i + 1} pageNumber={i + 1} pdfDoc={pdfDoc} containerRef={containerRef} />
          ))}
        </div>
      )}
    </div>
  );
};

const PdfPage: React.FC<{ pageNumber: number, pdfDoc: pdfjsLib.PDFDocumentProxy | null, containerRef: React.RefObject<HTMLDivElement> }> = ({ pageNumber, pdfDoc, containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;
    let renderTask: pdfjsLib.RenderTask | null = null;
    let isMounted = true;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (!isMounted) return;

        const containerWidth = containerRef.current!.clientWidth;
        const viewportUnscaled = page.getViewport({ scale: 1 });
        const scale = (containerWidth - 60) / viewportUnscaled.width;
        
        const viewport = page.getViewport({ scale: scale > 0 ? scale : 1 });

        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d');
        if (!context) return;

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";

        const transform = outputScale !== 1
          ? [outputScale, 0, 0, outputScale, 0, 0]
          : undefined;

        const renderContext = {
          canvasContext: context,
          transform: transform as any,
          viewport: viewport,
        } as any;

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if ((err as Error).name !== 'RenderingCancelledException') {
          console.error("Error rendering PDF page:", err);
        }
      }
    };
    renderPage();
    return () => {
      isMounted = false;
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, pageNumber, containerRef]);

  return (
    <canvas ref={canvasRef} className="shadow-2xl bg-white" />
  );
};
