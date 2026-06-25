import { WebPlugin } from '@capacitor/core';

import type {
  PrintBase64Options,
  PrintFileOptions,
  PrintHtmlOptions,
  PrintOptions,
  PrintIframeOptions,
  PrintPdfOptions,
  PrinterPlugin,
} from './definitions';

export class PrinterWeb extends WebPlugin implements PrinterPlugin {
  async printBase64(options: PrintBase64Options): Promise<void> {
    const { data, mimeType, name } = options;

    // Convert base64 to blob
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Create object URL and print
    const url = URL.createObjectURL(blob);
    await this.printFromUrl(url, name);
    URL.revokeObjectURL(url);
  }

  async printFile(options: PrintFileOptions): Promise<void> {
    const { path, name } = options;

    // On web, we can only print URLs that are accessible
    // This will work for file:// URLs in some browsers or HTTP(S) URLs
    await this.printFromUrl(path, name);
  }

  async printHtml(options: PrintHtmlOptions): Promise<void> {
    const { html, name } = options;

    // Create a blob URL from the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    await this.printFromUrl(url, name);
    URL.revokeObjectURL(url);
  }

  async printPdf(options: PrintPdfOptions): Promise<void> {
    const { path, name } = options;

    // On web, print the PDF URL
    await this.printFromUrl(path, name);
  }

  async printIframe(options: PrintIframeOptions): Promise<void> {
    const { selector, name } = options;
    const iframe = document.querySelector(selector);

    if (!(iframe instanceof HTMLIFrameElement) || !iframe.contentWindow) {
      throw new Error(`iframe not found: ${selector}`);
    }

    const originalTitle = document.title;
    if (name) {
      document.title = name;
    }

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    document.title = originalTitle;
  }

  async printWebView(options?: PrintOptions): Promise<void> {
    // Set document title for print job name
    const originalTitle = document.title;
    if (options?.name) {
      document.title = options.name;
    }

    // Trigger browser print dialog
    window.print();

    // Restore original title
    document.title = originalTitle;
  }

  async getPluginVersion(): Promise<{ version: string }> {
    return { version: '7.0.0' };
  }

  private async printFromUrl(url: string, name?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';

      // Set up load handler
      iframe.onload = () => {
        try {
          // Set document title if name provided
          if (name && iframe.contentDocument) {
            iframe.contentDocument.title = name;
          }

          // Small delay to ensure content is loaded
          setTimeout(() => {
            try {
              // Try to access the iframe's window
              const iframeWindow = iframe.contentWindow;
              if (!iframeWindow) {
                throw new Error('Cannot access iframe window');
              }

              // Print the iframe content
              iframeWindow.focus();
              iframeWindow.print();

              // Clean up after a delay
              setTimeout(() => {
                document.body.removeChild(iframe);
                resolve();
              }, 100);
            } catch (error) {
              document.body.removeChild(iframe);
              reject(error);
            }
          }, 100);
        } catch (error) {
          document.body.removeChild(iframe);
          reject(error);
        }
      };

      iframe.onerror = () => {
        document.body.removeChild(iframe);
        reject(new Error('Failed to load content for printing'));
      };

      // Add iframe to document and set source
      document.body.appendChild(iframe);
      iframe.src = url;
    });
  }
}
