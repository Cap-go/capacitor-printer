export interface PrinterPlugin {
  /**
   * Presents the printing UI to print files encoded as base64 strings.
   *
   * **Platform Behavior:**
   * - **iOS**: Uses UIPrintInteractionController with base64 decoded data
   * - **Android**: Uses PrintManager with base64 decoded data
   * - **Web**: Creates a blob from base64 data and opens print dialog
   *
   * **Performance Warning:**
   * Large files can lead to app crashes due to memory constraints when decoding base64.
   * For files larger than 5MB, it's recommended to use printFile() instead.
   *
   * @param options - The base64 data and configuration for printing
   * @returns Promise that resolves when print dialog is dismissed
   * @throws Error if base64 data is invalid or printing fails
   * @since 7.0.0
   * @example
   * ```typescript
   * // Print a base64 encoded PDF
   * await Printer.printBase64({
   *   name: 'Invoice #12345',
   *   data: 'JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...',
   *   mimeType: 'application/pdf',
   * });
   *
   * // Print a base64 encoded image
   * await Printer.printBase64({
   *   name: 'Product Photo',
   *   data: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDA...',
   *   mimeType: 'image/jpeg',
   * });
   * ```
   */
  printBase64(options: PrintBase64Options): Promise<void>;

  /**
   * Presents the printing UI to print device files.
   *
   * **Platform Behavior:**
   * - **iOS**: Uses UIPrintInteractionController with file URL. Supports file:// paths or paths relative to app's documents directory.
   * - **Android**: Uses PrintManager with file path. Supports both content:// URIs and file:// paths.
   * - **Web**: Reads file and opens print dialog
   *
   * **Supported File Types:**
   * - PDF documents (application/pdf)
   * - Images: JPEG, PNG, GIF, HEIC, HEIF
   *
   * @param options - The file path and configuration for printing
   * @returns Promise that resolves when print dialog is dismissed
   * @throws Error if file path is invalid, file not found, or unsupported file type
   * @since 7.0.0
   * @example
   * ```typescript
   * // iOS: Print from app documents directory
   * await Printer.printFile({
   *   name: 'Contract',
   *   path: 'file:///var/mobile/Containers/Data/Application/.../Documents/contract.pdf',
   * });
   *
   * // Android: Print from content URI
   * await Printer.printFile({
   *   name: 'Receipt',
   *   path: 'content://com.android.providers.downloads.documents/document/123',
   *   mimeType: 'application/pdf',
   * });
   *
   * // Android: Print from file path
   * await Printer.printFile({
   *   name: 'Photo',
   *   path: 'file:///storage/emulated/0/Download/photo.jpg',
   *   mimeType: 'image/jpeg',
   * });
   * ```
   */
  printFile(options: PrintFileOptions): Promise<void>;

  /**
   * Presents the printing UI to print HTML documents.
   *
   * **Platform Behavior:**
   * - **iOS**: Renders HTML in WKWebView, then prints using UIPrintInteractionController
   * - **Android**: Renders HTML in WebView, then prints using PrintManager
   * - **Web**: Creates iframe with HTML content and triggers print dialog
   *
   * **HTML Requirements:**
   * - Should be a complete HTML document with proper structure
   * - Can include inline CSS styles or style tags
   * - External resources (images, stylesheets) should use absolute URLs
   * - Print-specific CSS can be added using @media print rules
   *
   * **CSS Print Styling:**
   * Use CSS media queries to customize print output:
   * - Control page breaks: page-break-before, page-break-after, page-break-inside
   * - Hide elements: display: none for no-print classes
   * - Adjust font sizes and colors for print
   *
   * @param options - The HTML content and configuration for printing
   * @returns Promise that resolves when print dialog is dismissed
   * @throws Error if HTML is invalid or printing fails
   * @since 7.0.0
   * @example
   * ```typescript
   * // Simple HTML document
   * await Printer.printHtml({
   *   name: 'Sales Report',
   *   html: '<html><body><h1>Q4 Sales Report</h1><p>Revenue: $125,000</p></body></html>',
   * });
   *
   * // HTML with print-specific CSS
   * await Printer.printHtml({
   *   name: 'Styled Invoice',
   *   html: `
   *     <html>
   *       <head>
   *         <style>
   *           @media print {
   *             body { font-size: 12pt; }
   *             .no-print { display: none; }
   *             h1 { page-break-before: always; }
   *           }
   *         </style>
   *       </head>
   *       <body>
   *         <h1>Invoice #12345</h1>
   *         <p>Amount due: $299.99</p>
   *         <button class="no-print">Don't print this button</button>
   *       </body>
   *     </html>
   *   `,
   * });
   * ```
   */
  printHtml(options: PrintHtmlOptions): Promise<void>;

  /**
   * Presents the printing UI to print PDF documents.
   *
   * **Platform Behavior:**
   * - **iOS**: Uses UIPrintInteractionController with PDF file URL
   * - **Android**: Uses PrintManager with PdfDocument
   * - **Web**: Creates object URL and opens print dialog
   *
   * **File Path Requirements:**
   * - **iOS**: Must be file:// path or relative to app's documents directory
   * - **Android**: Supports content:// URIs (from downloads, media store) or file:// paths
   * - **Web**: Must be accessible file path
   *
   * @param options - The PDF file path and configuration for printing
   * @returns Promise that resolves when print dialog is dismissed
   * @throws Error if PDF path is invalid, file not found, or not a valid PDF
   * @since 7.0.0
   * @example
   * ```typescript
   * // Print PDF from app storage
   * await Printer.printPdf({
   *   name: 'Annual Report 2024',
   *   path: 'file:///var/mobile/Containers/Data/Application/.../Documents/report.pdf',
   * });
   *
   * // Print PDF from Android downloads
   * await Printer.printPdf({
   *   name: 'Downloaded Document',
   *   path: 'content://com.android.providers.downloads.documents/document/123',
   * });
   * ```
   */
  printPdf(options: PrintPdfOptions): Promise<void>;

  /**
   * Presents the printing UI to print web view content.
   *
   * Prints the current content displayed in your app's web view.
   *
   * **Platform Behavior:**
   * - **iOS**: Uses UIPrintInteractionController with WKWebView's view printable
   * - **Android**: Uses WebView.createPrintDocumentAdapter() with PrintManager
   * - **Web**: Triggers window.print() for current page
   *
   * **Print Styling:**
   * Supports CSS print media queries for customization. The web view's current
   * styles will be applied, including any @media print rules.
   *
   * **Use Cases:**
   * - Print the current app screen/page
   * - Print web-based reports or dashboards
   * - Print user-generated content displayed in web view
   *
   * @param options - Optional configuration for printing (name only)
   * @returns Promise that resolves when print dialog is dismissed
   * @throws Error if web view is not available or printing fails
   * @since 7.0.0
   * @example
   * ```typescript
   * // Print current web view with default name
   * await Printer.printWebView();
   *
   * // Print with custom job name
   * await Printer.printWebView({
   *   name: 'Dashboard Screenshot',
   * });
   *
   * // Use with print-specific CSS in your HTML
   * // Add this to your app's CSS:
   * // @media print {
   * //   .no-print { display: none; }
   * //   body { font-size: 12pt; }
   * // }
   * await Printer.printWebView({
   *   name: 'User Profile',
   * });
   * ```
   */

  /**
   * Presents the printing UI for content inside an iframe element.
   *
   * Useful when the full HTML document is too large to pass to printHtml().
   *
   * **Platform Behavior:**
   * - **iOS**: Evaluates JavaScript in the WebView to print the iframe content
   * - **Android**: Evaluates JavaScript in the WebView to print the iframe content
   * - **Web**: Finds the iframe and triggers its print dialog
   *
   * @param options - CSS selector and optional print job name
   * @returns Promise that resolves when print dialog is dismissed
   * @throws Error if the iframe is not found or printing fails
   * @since 8.0.19
   * @example
   * ```typescript
   * await Printer.printIframe({
   *   selector: '#report-frame',
   *   name: 'Monthly Report',
   * });
   * ```
   */
  printIframe(options: PrintIframeOptions): Promise<void>;

  printWebView(options?: PrintOptions): Promise<void>;

  /**
   * Get the native Capacitor plugin version.
   *
   * Returns the hardcoded plugin version from native code (iOS/Android) or
   * package version (Web). This is useful for debugging and ensuring plugin
   * compatibility.
   *
   * @returns Promise that resolves with the plugin version string
   * @throws Error if getting the version fails
   * @since 7.0.0
   * @example
   * ```typescript
   * const { version } = await Printer.getPluginVersion();
   * console.log('Printer plugin version:', version);
   * // Output: "7.0.0"
   * ```
   */
  getPluginVersion(): Promise<{ version: string }>;
}

/**
 * Options for printing base64 encoded data.
 *
 * @since 7.0.0
 */
export interface PrintBase64Options extends PrintOptions {
  /**
   * Valid base64 encoded string representing the file content.
   *
   * The base64 string should NOT include the data URL prefix (e.g., "data:application/pdf;base64,").
   * Only provide the raw base64 encoded content.
   *
   * **Performance Considerations:**
   * - Base64 encoding increases data size by approximately 33%
   * - Large files (>5MB) may cause memory issues when decoding
   * - Consider using printFile() for large documents
   *
   * **Platform Notes:**
   * - **iOS**: Decoded to NSData and passed to UIPrintInteractionController
   * - **Android**: Decoded to byte array and written to temporary file
   * - **Web**: Converted to Blob for printing
   *
   * @since 7.0.0
   * @example 'JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...'
   */
  data: string;

  /**
   * MIME type of the base64 encoded data.
   *
   * **Supported types:**
   * - `application/pdf` - PDF documents
   * - `image/jpeg` - JPEG images
   * - `image/png` - PNG images
   * - `image/gif` - GIF images (iOS/Android only)
   * - `image/heic` - HEIC images (iOS only)
   * - `image/heif` - HEIF images (iOS only)
   *
   * **Platform Support:**
   * - All platforms support PDF, JPEG, and PNG
   * - GIF support varies by platform
   * - HEIC/HEIF are iOS-specific formats
   *
   * @since 7.0.0
   * @example 'application/pdf'
   * @example 'image/jpeg'
   */
  mimeType: string;
}

/**
 * Options for printing files from device storage.
 *
 * @since 7.0.0
 */
export interface PrintFileOptions extends PrintOptions {
  /**
   * Path to the file to print.
   *
   * **iOS Path Formats:**
   * - `file://` URL: Full file URL path
   * - Relative path: Path relative to app's documents directory
   * - Must be within app's accessible directories (documents, temporary, cache)
   *
   * **Android Path Formats:**
   * - `content://` URI: Content provider URI (recommended for external files)
   * - `file://` path: Direct file system path
   * - Must have read permission for the file
   *
   * **Common Use Cases:**
   * - App documents: Files saved in app's document directory
   * - Downloads: Files from system downloads folder (use content:// on Android)
   * - Temporary files: Files in app's temporary/cache directory
   * - Shared storage: Files from external storage (Android, requires permissions)
   *
   * @since 7.0.0
   * @platform ios Supports file:// paths and relative paths
   * @platform android Supports content:// URIs and file:// paths
   * @example 'content://com.android.providers.downloads.documents/document/123'
   * @example 'file:///var/mobile/Containers/Data/Application/.../Documents/document.pdf'
   * @example 'file:///storage/emulated/0/Download/receipt.pdf'
   */
  path: string;

  /**
   * MIME type of the file.
   *
   * **Platform Behavior:**
   * - **Android**: REQUIRED for content:// URIs. Helps the system determine how to handle the file.
   *                Optional for file:// paths (auto-detected from extension).
   * - **iOS**: Ignored. File type is auto-detected from file extension.
   * - **Web**: Optional. Auto-detected if not provided.
   *
   * **Common MIME Types:**
   * - `application/pdf` - PDF documents
   * - `image/jpeg` - JPEG images
   * - `image/png` - PNG images
   * - `image/gif` - GIF images
   *
   * @since 7.0.0
   * @default Undefined (auto-detected from file extension)
   * @platform android Used for content:// URIs and file type detection
   * @platform ios Ignored (auto-detected)
   * @example 'application/pdf'
   * @example 'image/jpeg'
   */
  mimeType?: string;
}

/**
 * Options for printing HTML content.
 *
 * @since 7.0.0
 */
export interface PrintHtmlOptions extends PrintOptions {
  /**
   * HTML content to print.
   *
   * **Content Requirements:**
   * - Should be a complete HTML document with `<html>`, `<head>`, and `<body>` tags
   * - Can include inline CSS styles or `<style>` tags
   * - External resources (images, fonts) should use absolute URLs
   * - JavaScript is not executed during print rendering
   *
   * **Print Optimization Tips:**
   * - Use `@media print` CSS rules for print-specific styling
   * - Control page breaks with `page-break-before`, `page-break-after`, `page-break-inside`
   * - Hide UI elements using `.no-print { display: none; }` class
   * - Adjust font sizes for readability (12pt is standard for print)
   * - Use print-friendly colors (avoid dark backgrounds)
   *
   * **Platform Rendering:**
   * - **iOS**: Rendered in WKWebView before printing
   * - **Android**: Rendered in WebView before printing
   * - **Web**: Rendered in hidden iframe before printing
   *
   * **Character Encoding:**
   * - UTF-8 is recommended and default
   * - Include charset in HTML: `<meta charset="UTF-8">`
   *
   * @since 7.0.0
   * @example '<html><body><h1>Hello World</h1><p>This is a test document.</p></body></html>'
   * @example
   * ```typescript
   * const htmlWithStyles = `
   *   <html>
   *     <head>
   *       <meta charset="UTF-8">
   *       <style>
   *         @media print {
   *           body { font-family: Arial, sans-serif; font-size: 12pt; }
   *           .no-print { display: none; }
   *           h1 { color: #333; page-break-before: always; }
   *         }
   *       </style>
   *     </head>
   *     <body>
   *       <h1>Invoice #12345</h1>
   *       <p>Amount: $299.99</p>
   *     </body>
   *   </html>
   * `;
   * ```
   */
  html: string;
}

/**
 * Options for printing PDF documents.
 *
 * @since 7.0.0
 */
export interface PrintPdfOptions extends PrintOptions {
  /**
   * Path to the PDF document.
   *
   * **iOS Path Formats:**
   * - `file://` URL: Full file URL path to PDF document
   * - Relative path: Path relative to app's documents directory
   * - Must be within app's accessible directories (documents, temporary, cache)
   * - PDF must be valid and not password-protected
   *
   * **Android Path Formats:**
   * - `content://` URI: Content provider URI (recommended for external PDFs)
   * - `file://` path: Direct file system path to PDF
   * - Must have read permission for the file
   * - Supports both single-page and multi-page PDFs
   *
   * **Web Path Formats:**
   * - Relative or absolute path accessible from web context
   * - Must be a valid PDF file
   *
   * **Validation:**
   * - File must exist at the specified path
   * - File must be a valid PDF (checked by magic number/header)
   * - File must be readable by the app
   *
   * **Common Sources:**
   * - App documents: PDFs saved in app's document directory
   * - Downloads: PDFs from system downloads (use content:// on Android)
   * - Generated PDFs: Temporary PDFs created by the app
   * - Network downloads: PDFs downloaded and saved locally
   *
   * @since 7.0.0
   * @platform ios Supports file:// paths and relative paths
   * @platform android Supports content:// URIs and file:// paths
   * @platform web Supports accessible file paths
   * @example 'content://com.android.providers.downloads.documents/document/123'
   * @example 'file:///var/mobile/Containers/Data/Application/.../Documents/document.pdf'
   * @example 'file:///storage/emulated/0/Download/report.pdf'
   * @example 'Documents/invoice-2024.pdf'
   */
  path: string;
}

/**
 * Base options for all print operations.
 *
 * @since 7.0.0
 */
export interface PrintOptions {
  /**
   * Name of the print job.
   *
   * **Usage:**
   * - Displayed in the system print queue
   * - Shown in print history/logs
   * - May appear in printer status displays
   * - Used as default filename for "Save as PDF" option
   *
   * **Platform Behavior:**
   * - **iOS**: Shown in print preview header and activity view
   * - **Android**: Displayed in print job notification and print queue
   * - **Web**: Used as document title in print dialog
   *
   * **Best Practices:**
   * - Use descriptive names (e.g., "Invoice #12345", "Q4 Report")
   * - Keep under 50 characters for better display
   * - Avoid special characters that may cause issues in filenames
   * - Include relevant identifiers (order numbers, dates, etc.)
   *
   * **Examples:**
   * - "Invoice #12345"
   * - "Sales Report - 2024 Q4"
   * - "Customer Receipt - John Doe"
   * - "Product Photo - SKU-ABC123"
   *
   * @since 7.0.0
   * @default 'Document'
   * @platform ios Shown in print preview and activity view
   * @platform android Shown in print queue and notifications
   * @platform web Used as document title in print dialog
   * @example 'Invoice #12345'
   * @example 'Annual Report 2024'
   * @example 'Receipt - Order #789'
   */
  name?: string;
}

/**
 * Type alias for print web view options.
 *
 * @since 7.0.0
 */

/**
 * Options for printing iframe content.
 *
 * @since 8.0.19
 */
export interface PrintIframeOptions extends PrintOptions {
  /**
   * CSS selector for the iframe element to print.
   *
   * The selector must match a single iframe in the current document.
   *
   * @since 8.0.19
   * @example '#report-frame'
   * @example 'iframe[name="invoice"]'
   */
  selector: string;
}

export type PrintWebViewOptions = PrintOptions;
