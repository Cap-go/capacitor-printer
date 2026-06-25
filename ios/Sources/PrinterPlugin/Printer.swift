import Foundation
import UIKit
import WebKit

@objc public class Printer: NSObject {

    enum PrinterError: Error {
        case invalidBase64Data
        case fileNotFound
        case unsupportedMimeType
        case printingNotAvailable
        case invalidData
    }

    /// Print base64 encoded data
    public func printBase64(
        data: String,
        mimeType: String,
        name: String,
        presentingViewController: UIViewController?
    ) throws {
        // Decode base64 data
        guard let decodedData = Data(base64Encoded: data) else {
            throw PrinterError.invalidBase64Data
        }

        // Create printable item based on MIME type
        let printInfo = UIPrintInfo(dictionary: nil)
        printInfo.jobName = name
        printInfo.outputType = .general

        var printFormatter: UIPrintFormatter?
        var printItem: Any?

        switch mimeType.lowercased() {
        case "application/pdf":
            printInfo.outputType = .general
            printItem = decodedData

        case "image/jpeg", "image/jpg", "image/png", "image/gif", "image/heic", "image/heif":
            printInfo.outputType = .photo
            if let image = UIImage(data: decodedData) {
                printItem = image
            } else {
                throw PrinterError.invalidData
            }

        default:
            throw PrinterError.unsupportedMimeType
        }

        try presentPrintController(
            printInfo: printInfo,
            printFormatter: printFormatter,
            printItem: printItem,
            presentingViewController: presentingViewController
        )
    }

    /// Print file from path
    public func printFile(
        path: String,
        name: String,
        presentingViewController: UIViewController?
    ) throws {
        // Convert path to URL
        var fileURL: URL

        if path.hasPrefix("file://") {
            fileURL = URL(fileURLWithPath: String(path.dropFirst(7)))
        } else {
            fileURL = URL(fileURLWithPath: path)
        }

        // Check if file exists
        guard FileManager.default.fileExists(atPath: fileURL.path) else {
            throw PrinterError.fileNotFound
        }

        let printInfo = UIPrintInfo(dictionary: nil)
        printInfo.jobName = name
        printInfo.outputType = .general

        try presentPrintController(
            printInfo: printInfo,
            printFormatter: nil,
            printItem: fileURL,
            presentingViewController: presentingViewController
        )
    }

    /// Print HTML content
    public func printHtml(
        html: String,
        name: String,
        presentingViewController: UIViewController?
    ) throws {
        let printInfo = UIPrintInfo(dictionary: nil)
        printInfo.jobName = name
        printInfo.outputType = .general

        // Create a UIMarkupTextPrintFormatter for HTML
        let formatter = UIMarkupTextPrintFormatter(markupText: html)

        try presentPrintController(
            printInfo: printInfo,
            printFormatter: formatter,
            printItem: nil,
            presentingViewController: presentingViewController
        )
    }

    /// Print PDF file
    public func printPdf(
        path: String,
        name: String,
        presentingViewController: UIViewController?
    ) throws {
        // Convert path to URL
        var fileURL: URL

        if path.hasPrefix("file://") {
            fileURL = URL(fileURLWithPath: String(path.dropFirst(7)))
        } else {
            fileURL = URL(fileURLWithPath: path)
        }

        // Check if file exists
        guard FileManager.default.fileExists(atPath: fileURL.path) else {
            throw PrinterError.fileNotFound
        }

        let printInfo = UIPrintInfo(dictionary: nil)
        printInfo.jobName = name
        printInfo.outputType = .general

        try presentPrintController(
            printInfo: printInfo,
            printFormatter: nil,
            printItem: fileURL,
            presentingViewController: presentingViewController
        )
    }

    /// Print iframe content from the current web view
    public func printIframe(
        webView: WKWebView,
        selector: String,
        name: String
    ) throws {
        let escapedSelector = selector
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\'", with: "\\\'")
        let escapedName = name
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\"", with: "\\\"")
            .replacingOccurrences(of: "\'", with: "\\\'")

        let script = """
        (function() {
            var frame = document.querySelector('\\(escapedSelector)');
            if (!frame || !frame.contentWindow) {
                throw new Error('iframe not found');
            }
            if ('\\(escapedName)') {
                document.title = '\\(escapedName)';
            }
            frame.contentWindow.focus();
            frame.contentWindow.print();
        })();
        """

        webView.evaluateJavaScript(script, completionHandler: nil)
    }

    /// Print web view content
    public func printWebView(
        webView: WKWebView,
        name: String,
        presentingViewController: UIViewController?
    ) throws {
        let printInfo = UIPrintInfo(dictionary: nil)
        printInfo.jobName = name
        printInfo.outputType = .general

        let formatter = webView.viewPrintFormatter()

        try presentPrintController(
            printInfo: printInfo,
            printFormatter: formatter,
            printItem: nil,
            presentingViewController: presentingViewController
        )
    }

    // MARK: - Private Helper Methods

    private func presentPrintController(
        printInfo: UIPrintInfo,
        printFormatter: UIPrintFormatter?,
        printItem: Any?,
        presentingViewController: UIViewController?
    ) throws {
        guard UIPrintInteractionController.isPrintingAvailable else {
            throw PrinterError.printingNotAvailable
        }

        guard let viewController = presentingViewController else {
            throw PrinterError.printingNotAvailable
        }

        let printController = UIPrintInteractionController.shared
        printController.printInfo = printInfo

        if let formatter = printFormatter {
            printController.printFormatter = formatter
        } else if let item = printItem {
            printController.printingItem = item
        }

        // Present print controller
        if UIDevice.current.userInterfaceIdiom == .pad {
            // For iPad, present as popover
            printController.present(
                from: viewController.view.bounds,
                in: viewController.view,
                animated: true,
                completionHandler: nil
            )
        } else {
            // For iPhone, present modally
            printController.present(
                animated: true,
                completionHandler: nil
            )
        }
    }
}
