# @capgo/capacitor-printer
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Missing a feature? We'll build the plugin for you 💪</a></h2>
</div>

Capacitor plugin for printing documents, HTML, PDFs, images and web views on iOS and Android.

## Why Capacitor Printer?

A **free and open-source** printing solution with comprehensive features:

- **Multiple formats** - Print HTML, PDFs, images, and base64 data
- **Native APIs** - Uses UIPrintInteractionController (iOS) and PrintManager (Android)
- **Web support** - Works across all platforms including web browsers
- **Print customization** - Support for CSS print styles and custom page names
- **Cross-platform** - Consistent API across iOS, Android, and Web

Perfect for invoice generation, report printing, document sharing, and any app requiring native printing capabilities.

## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/printer/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |
| v7.\*.\*       | v7.\*.\*                | On demand   |
| v6.\*.\*       | v6.\*.\*                | ❌          |
| v5.\*.\*       | v5.\*.\*                | ❌          |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Install

```bash
npm install @capgo/capacitor-printer
npx cap sync
```

## Usage

```typescript
import { Printer } from '@capgo/capacitor-printer';

// Print HTML content
await Printer.printHtml({
  name: 'My Document',
  html: '<html><body><h1>Hello World</h1><p>This is a test document.</p></body></html>',
});

// Print PDF file
await Printer.printPdf({
  name: 'Invoice',
  path: 'file:///path/to/document.pdf',
});

// Print image from base64
await Printer.printBase64({
  name: 'Photo',
  data: 'JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...',
  mimeType: 'image/jpeg',
});

// Print current web view
await Printer.printWebView({
  name: 'Web Page',
});
```

## API

<docgen-index>

* [`printBase64(...)`](#printbase64)
* [`printFile(...)`](#printfile)
* [`printHtml(...)`](#printhtml)
* [`printPdf(...)`](#printpdf)
* [`printWebView(...)`](#printwebview)
* [`getPluginVersion()`](#getpluginversion)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### printBase64(...)

```typescript
printBase64(options: PrintBase64Options) => Promise<void>
```

Presents the printing UI to print files encoded as base64 strings.

**Platform Behavior:**
- **iOS**: Uses UIPrintInteractionController with base64 decoded data
- **Android**: Uses PrintManager with base64 decoded data
- **Web**: Creates a blob from base64 data and opens print dialog

**Performance Warning:**
Large files can lead to app crashes due to memory constraints when decoding base64.
For files larger than 5MB, it's recommended to use printFile() instead.

| Param         | Type                                                              | Description                                      |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------------ |
| **`options`** | <code><a href="#printbase64options">PrintBase64Options</a></code> | - The base64 data and configuration for printing |

**Since:** 7.0.0

--------------------


### printFile(...)

```typescript
printFile(options: PrintFileOptions) => Promise<void>
```

Presents the printing UI to print device files.

**Platform Behavior:**
- **iOS**: Uses UIPrintInteractionController with file URL. Supports file:// paths or paths relative to app's documents directory.
- **Android**: Uses PrintManager with file path. Supports both content:// URIs and file:// paths.
- **Web**: Reads file and opens print dialog

**Supported File Types:**
- PDF documents (application/pdf)
- Images: JPEG, PNG, GIF, HEIC, HEIF

| Param         | Type                                                          | Description                                    |
| ------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| **`options`** | <code><a href="#printfileoptions">PrintFileOptions</a></code> | - The file path and configuration for printing |

**Since:** 7.0.0

--------------------


### printHtml(...)

```typescript
printHtml(options: PrintHtmlOptions) => Promise<void>
```

Presents the printing UI to print HTML documents.

**Platform Behavior:**
- **iOS**: Renders HTML in WKWebView, then prints using UIPrintInteractionController
- **Android**: Renders HTML in WebView, then prints using PrintManager
- **Web**: Creates iframe with HTML content and triggers print dialog

**HTML Requirements:**
- Should be a complete HTML document with proper structure
- Can include inline CSS styles or style tags
- External resources (images, stylesheets) should use absolute URLs
- Print-specific CSS can be added using @media print rules

**CSS Print Styling:**
Use CSS media queries to customize print output:
- Control page breaks: page-break-before, page-break-after, page-break-inside
- Hide elements: display: none for no-print classes
- Adjust font sizes and colors for print

| Param         | Type                                                          | Description                                       |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#printhtmloptions">PrintHtmlOptions</a></code> | - The HTML content and configuration for printing |

**Since:** 7.0.0

--------------------


### printPdf(...)

```typescript
printPdf(options: PrintPdfOptions) => Promise<void>
```

Presents the printing UI to print PDF documents.

**Platform Behavior:**
- **iOS**: Uses UIPrintInteractionController with PDF file URL
- **Android**: Uses PrintManager with PdfDocument
- **Web**: Creates object URL and opens print dialog

**File Path Requirements:**
- **iOS**: Must be file:// path or relative to app's documents directory
- **Android**: Supports content:// URIs (from downloads, media store) or file:// paths
- **Web**: Must be accessible file path

| Param         | Type                                                        | Description                                        |
| ------------- | ----------------------------------------------------------- | -------------------------------------------------- |
| **`options`** | <code><a href="#printpdfoptions">PrintPdfOptions</a></code> | - The PDF file path and configuration for printing |

**Since:** 7.0.0

--------------------


### printWebView(...)

```typescript
printWebView(options?: PrintOptions | undefined) => Promise<void>
```

Presents the printing UI to print web view content.

Prints the current content displayed in your app's web view.

**Platform Behavior:**
- **iOS**: Uses UIPrintInteractionController with WKWebView's view printable
- **Android**: Uses WebView.createPrintDocumentAdapter() with PrintManager
- **Web**: Triggers window.print() for current page

**Print Styling:**
Supports CSS print media queries for customization. The web view's current
styles will be applied, including any @media print rules.

**Use Cases:**
- Print the current app screen/page
- Print web-based reports or dashboards
- Print user-generated content displayed in web view

| Param         | Type                                                  | Description                                       |
| ------------- | ----------------------------------------------------- | ------------------------------------------------- |
| **`options`** | <code><a href="#printoptions">PrintOptions</a></code> | - Optional configuration for printing (name only) |

**Since:** 7.0.0

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the native Capacitor plugin version.

Returns the hardcoded plugin version from native code (iOS/Android) or
package version (Web). This is useful for debugging and ensuring plugin
compatibility.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

**Since:** 7.0.0

--------------------


### Interfaces


#### PrintBase64Options

Options for printing base64 encoded data.

| Prop           | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Since |
| -------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`data`**     | <code>string</code> | Valid base64 encoded string representing the file content. The base64 string should NOT include the data URL prefix (e.g., "data:application/pdf;base64,"). Only provide the raw base64 encoded content. **Performance Considerations:** - Base64 encoding increases data size by approximately 33% - Large files (&gt;5MB) may cause memory issues when decoding - Consider using printFile() for large documents **Platform Notes:** - **iOS**: Decoded to NSData and passed to UIPrintInteractionController - **Android**: Decoded to byte array and written to temporary file - **Web**: Converted to Blob for printing | 7.0.0 |
| **`mimeType`** | <code>string</code> | MIME type of the base64 encoded data. **Supported types:** - `application/pdf` - PDF documents - `image/jpeg` - JPEG images - `image/png` - PNG images - `image/gif` - GIF images (iOS/Android only) - `image/heic` - HEIC images (iOS only) - `image/heif` - HEIF images (iOS only) **Platform Support:** - All platforms support PDF, JPEG, and PNG - GIF support varies by platform - HEIC/HEIF are iOS-specific formats                                                                                                                                                                                                 | 7.0.0 |


#### PrintFileOptions

Options for printing files from device storage.

| Prop           | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Default                                                    | Since |
| -------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ----- |
| **`path`**     | <code>string</code> | Path to the file to print. **iOS Path Formats:** - `file://` URL: Full file URL path - Relative path: Path relative to app's documents directory - Must be within app's accessible directories (documents, temporary, cache) **Android Path Formats:** - `content://` URI: Content provider URI (recommended for external files) - `file://` path: Direct file system path - Must have read permission for the file **Common Use Cases:** - App documents: Files saved in app's document directory - Downloads: Files from system downloads folder (use content:// on Android) - Temporary files: Files in app's temporary/cache directory - Shared storage: Files from external storage (Android, requires permissions) |                                                            | 7.0.0 |
| **`mimeType`** | <code>string</code> | MIME type of the file. **Platform Behavior:** - **Android**: REQUIRED for content:// URIs. Helps the system determine how to handle the file. Optional for file:// paths (auto-detected from extension). - **iOS**: Ignored. File type is auto-detected from file extension. - **Web**: Optional. Auto-detected if not provided. **Common MIME Types:** - `application/pdf` - PDF documents - `image/jpeg` - JPEG images - `image/png` - PNG images - `image/gif` - GIF images                                                                                                                                                                                                                                           | <code>Undefined (auto-detected from file extension)</code> | 7.0.0 |


#### PrintHtmlOptions

Options for printing HTML content.

| Prop       | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Since |
| ---------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`html`** | <code>string</code> | HTML content to print. **Content Requirements:** - Should be a complete HTML document with `&lt;html&gt;`, `&lt;head&gt;`, and `&lt;body&gt;` tags - Can include inline CSS styles or `&lt;style&gt;` tags - External resources (images, fonts) should use absolute URLs - JavaScript is not executed during print rendering **Print Optimization Tips:** - Use `@media print` CSS rules for print-specific styling - Control page breaks with `page-break-before`, `page-break-after`, `page-break-inside` - Hide UI elements using `.no-print { display: none; }` class - Adjust font sizes for readability (12pt is standard for print) - Use print-friendly colors (avoid dark backgrounds) **Platform Rendering:** - **iOS**: Rendered in WKWebView before printing - **Android**: Rendered in WebView before printing - **Web**: Rendered in hidden iframe before printing **Character Encoding:** - UTF-8 is recommended and default - Include charset in HTML: `&lt;meta charset="UTF-8"&gt;` | 7.0.0 |


#### PrintPdfOptions

Options for printing PDF documents.

| Prop       | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Since |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| **`path`** | <code>string</code> | Path to the PDF document. **iOS Path Formats:** - `file://` URL: Full file URL path to PDF document - Relative path: Path relative to app's documents directory - Must be within app's accessible directories (documents, temporary, cache) - PDF must be valid and not password-protected **Android Path Formats:** - `content://` URI: Content provider URI (recommended for external PDFs) - `file://` path: Direct file system path to PDF - Must have read permission for the file - Supports both single-page and multi-page PDFs **Web Path Formats:** - Relative or absolute path accessible from web context - Must be a valid PDF file **Validation:** - File must exist at the specified path - File must be a valid PDF (checked by magic number/header) - File must be readable by the app **Common Sources:** - App documents: PDFs saved in app's document directory - Downloads: PDFs from system downloads (use content:// on Android) - Generated PDFs: Temporary PDFs created by the app - Network downloads: PDFs downloaded and saved locally | 7.0.0 |


#### PrintOptions

Base options for all print operations.

| Prop       | Type                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Default                 | Since |
| ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----- |
| **`name`** | <code>string</code> | Name of the print job. **Usage:** - Displayed in the system print queue - Shown in print history/logs - May appear in printer status displays - Used as default filename for "Save as PDF" option **Platform Behavior:** - **iOS**: Shown in print preview header and activity view - **Android**: Displayed in print job notification and print queue - **Web**: Used as document title in print dialog **Best Practices:** - Use descriptive names (e.g., "Invoice #12345", "Q4 Report") - Keep under 50 characters for better display - Avoid special characters that may cause issues in filenames - Include relevant identifiers (order numbers, dates, etc.) **Examples:** - "Invoice #12345" - "Sales Report - 2024 Q4" - "Customer Receipt - John Doe" - "Product Photo - SKU-ABC123" | <code>'Document'</code> | 7.0.0 |

</docgen-api>

## Android Configuration

### ProGuard

If you are using ProGuard, add the following rules to your `proguard-rules.pro` file:

```pro
-keep class com.capgo.printer.** { *; }
```

### Variables

You can configure the following project variables in your `variables.gradle` file:

```gradle
ext {
  androidxDocumentFileVersion = '1.0.1'
  androidxPrintVersion = '1.0.0'
}
```

## Platform Support

| Platform | Supported |
| -------- | --------- |
| iOS      | ✅        |
| Android  | ✅        |
| Web      | ✅        |

## Notes

### Large Files

When printing base64 encoded data, large files can lead to app crashes due to memory constraints. For large files, it's recommended to save them to the device first and use `printFile()` instead.

### Web Platform

On the web platform:
- `printWebView()` triggers the browser's native print dialog
- Other methods create an iframe and print its content
- Some browsers may have security restrictions on printing certain file types

### Print Styles

When printing web content, you can use CSS media queries to customize the print output:

```css
@media print {
  /* Your print styles here */
  body {
    font-size: 12pt;
  }
  .no-print {
    display: none;
  }
}
```
