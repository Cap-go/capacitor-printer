package com.capgo.printer;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.PrintManager;
import android.util.Base64;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.NonNull;
import androidx.documentfile.provider.DocumentFile;
import androidx.print.PrintHelper;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class Printer {

    private final Context context;
    private final Activity activity;

    public Printer(Context context, Activity activity) {
        this.context = context;
        this.activity = activity;
    }

    public void printBase64(String data, String mimeType, String name) throws Exception {
        byte[] decodedData = Base64.decode(data, Base64.DEFAULT);

        // Handle images separately
        if (mimeType.startsWith("image/")) {
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedData, 0, decodedData.length);
            if (bitmap == null) {
                throw new Exception("Failed to decode image from base64 data");
            }
            printImage(bitmap, name);
            return;
        }

        // For PDFs and other documents, save to temp file and print
        File tempFile = saveTempFile(decodedData, mimeType);
        printDocument(tempFile, name);
    }

    public void printFile(String path, String mimeType, String name) throws Exception {
        Uri uri = Uri.parse(path);

        // Handle content:// URIs
        if ("content".equals(uri.getScheme())) {
            DocumentFile documentFile = DocumentFile.fromSingleUri(context, uri);
            if (documentFile == null || !documentFile.exists()) {
                throw new Exception("File not found: " + path);
            }

            // Determine MIME type if not provided
            if (mimeType == null) {
                mimeType = documentFile.getType();
            }

            // Handle images separately
            if (mimeType != null && mimeType.startsWith("image/")) {
                printImageFromUri(uri, name);
                return;
            }

            // For documents, use direct URI
            printDocumentFromUri(uri, name);
        } else {
            // Handle file:// URIs
            File file = new File(uri.getPath());
            if (!file.exists()) {
                throw new Exception("File not found: " + path);
            }

            // Determine MIME type if not provided
            if (mimeType == null) {
                mimeType = getMimeTypeFromPath(file.getPath());
            }

            // Handle images separately
            if (mimeType != null && mimeType.startsWith("image/")) {
                Bitmap bitmap = BitmapFactory.decodeFile(file.getPath());
                if (bitmap == null) {
                    throw new Exception("Failed to decode image from file");
                }
                printImage(bitmap, name);
                return;
            }

            printDocument(file, name);
        }
    }

    public interface PrintHtmlCallback {
        void onSuccess();
        void onError(Exception e);
    }

    public void printHtml(String html, String name, PrintHtmlCallback callback) {
        activity.runOnUiThread(() -> {
            try {
                WebView webView = new WebView(context);
                webView.setWebViewClient(
                    new WebViewClient() {
                        @Override
                        public void onPageFinished(WebView view, String url) {
                            try {
                                createWebPrintJob(view, name);
                                callback.onSuccess();
                            } catch (Exception e) {
                                callback.onError(e);
                            }
                        }
                    }
                );

                webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
            } catch (Exception e) {
                callback.onError(e);
            }
        });
    }

    public void printPdf(String path, String name) throws Exception {
        Uri uri = Uri.parse(path);

        // Handle content:// URIs
        if ("content".equals(uri.getScheme())) {
            printDocumentFromUri(uri, name);
        } else {
            // Handle file:// URIs
            File file = new File(uri.getPath());
            if (!file.exists()) {
                throw new Exception("File not found: " + path);
            }
            printDocument(file, name);
        }
    }

    public void printWebView(WebView webView, String name) throws Exception {
        if (webView == null) {
            throw new Exception("WebView not available");
        }
        createWebPrintJob(webView, name);
    }

    // MARK: - Private Helper Methods

    private void printImage(Bitmap bitmap, String name) {
        PrintHelper printHelper = new PrintHelper(activity);
        printHelper.setScaleMode(PrintHelper.SCALE_MODE_FIT);
        printHelper.printBitmap(name, bitmap);
    }

    private void printImageFromUri(Uri uri, String name) throws Exception {
        try {
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            if (inputStream == null) {
                throw new Exception("Failed to open image file");
            }
            Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
            inputStream.close();

            if (bitmap == null) {
                throw new Exception("Failed to decode image");
            }

            printImage(bitmap, name);
        } catch (IOException e) {
            throw new Exception("Failed to read image file: " + e.getMessage());
        }
    }

    private void printDocument(File file, String name) throws Exception {
        PrintManager printManager = (PrintManager) context.getSystemService(Context.PRINT_SERVICE);
        if (printManager == null) {
            throw new Exception("Print service not available");
        }

        PrintDocumentAdapter printAdapter = new PdfDocumentAdapter(file);
        printManager.print(name, printAdapter, new PrintAttributes.Builder().build());
    }

    private void printDocumentFromUri(Uri uri, String name) throws Exception {
        PrintManager printManager = (PrintManager) context.getSystemService(Context.PRINT_SERVICE);
        if (printManager == null) {
            throw new Exception("Print service not available");
        }

        PrintDocumentAdapter printAdapter = new UriDocumentAdapter(uri);
        printManager.print(name, printAdapter, new PrintAttributes.Builder().build());
    }

    private void createWebPrintJob(WebView webView, String name) throws Exception {
        PrintManager printManager = (PrintManager) context.getSystemService(Context.PRINT_SERVICE);
        if (printManager == null) {
            throw new Exception("Print service not available");
        }

        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter(name);
        printManager.print(name, printAdapter, new PrintAttributes.Builder().build());
    }

    private File saveTempFile(byte[] data, String mimeType) throws IOException {
        String extension = getExtensionFromMimeType(mimeType);
        File tempFile = File.createTempFile("print_temp", extension, context.getCacheDir());

        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(data);
        }

        return tempFile;
    }

    private String getExtensionFromMimeType(String mimeType) {
        switch (mimeType.toLowerCase()) {
            case "application/pdf":
                return ".pdf";
            case "image/jpeg":
            case "image/jpg":
                return ".jpg";
            case "image/png":
                return ".png";
            case "image/gif":
                return ".gif";
            default:
                return ".tmp";
        }
    }

    private String getMimeTypeFromPath(String path) {
        String extension = path.substring(path.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "pdf":
                return "application/pdf";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            default:
                return "application/octet-stream";
        }
    }

    // Custom PrintDocumentAdapter for PDF files
    private class PdfDocumentAdapter extends PrintDocumentAdapter {

        private final File file;

        public PdfDocumentAdapter(File file) {
            this.file = file;
        }

        @Override
        public void onLayout(
            PrintAttributes oldAttributes,
            PrintAttributes newAttributes,
            CancellationSignal cancellationSignal,
            LayoutResultCallback callback,
            Bundle extras
        ) {
            if (cancellationSignal.isCanceled()) {
                callback.onLayoutCancelled();
                return;
            }

            PrintDocumentInfo info = new PrintDocumentInfo.Builder(file.getName())
                .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                .build();

            callback.onLayoutFinished(info, true);
        }

        @Override
        public void onWrite(
            PageRange[] pages,
            ParcelFileDescriptor destination,
            CancellationSignal cancellationSignal,
            WriteResultCallback callback
        ) {
            try (
                InputStream input = context.openFileInput(file.getName());
                OutputStream output = new FileOutputStream(destination.getFileDescriptor())
            ) {
                byte[] buf = new byte[1024];
                int bytesRead;
                while ((bytesRead = input.read(buf)) > 0) {
                    output.write(buf, 0, bytesRead);
                }

                callback.onWriteFinished(new PageRange[] { PageRange.ALL_PAGES });
            } catch (Exception e) {
                callback.onWriteFailed(e.getMessage());
            }
        }
    }

    // Custom PrintDocumentAdapter for URIs
    private class UriDocumentAdapter extends PrintDocumentAdapter {

        private final Uri uri;

        public UriDocumentAdapter(Uri uri) {
            this.uri = uri;
        }

        @Override
        public void onLayout(
            PrintAttributes oldAttributes,
            PrintAttributes newAttributes,
            CancellationSignal cancellationSignal,
            LayoutResultCallback callback,
            Bundle extras
        ) {
            if (cancellationSignal.isCanceled()) {
                callback.onLayoutCancelled();
                return;
            }

            String fileName = "Document";
            DocumentFile documentFile = DocumentFile.fromSingleUri(context, uri);
            if (documentFile != null && documentFile.getName() != null) {
                fileName = documentFile.getName();
            }

            PrintDocumentInfo info = new PrintDocumentInfo.Builder(fileName)
                .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                .build();

            callback.onLayoutFinished(info, true);
        }

        @Override
        public void onWrite(
            PageRange[] pages,
            ParcelFileDescriptor destination,
            CancellationSignal cancellationSignal,
            WriteResultCallback callback
        ) {
            try (
                InputStream input = context.getContentResolver().openInputStream(uri);
                OutputStream output = new FileOutputStream(destination.getFileDescriptor())
            ) {
                if (input == null) {
                    callback.onWriteFailed("Failed to open file");
                    return;
                }

                byte[] buf = new byte[1024];
                int bytesRead;
                while ((bytesRead = input.read(buf)) > 0) {
                    output.write(buf, 0, bytesRead);
                }

                callback.onWriteFinished(new PageRange[] { PageRange.ALL_PAGES });
            } catch (Exception e) {
                callback.onWriteFailed(e.getMessage());
            }
        }
    }
}
