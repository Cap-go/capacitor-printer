import Foundation
import Capacitor

@objc(PrinterPlugin)
public class PrinterPlugin: CAPPlugin, CAPBridgedPlugin {
    private let pluginVersion: String = "8.0.9"
    public let identifier = "PrinterPlugin"
    public let jsName = "Printer"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "printBase64", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "printFile", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "printHtml", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "printPdf", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "printWebView", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPluginVersion", returnType: CAPPluginReturnPromise)
    ]

    private let implementation = Printer()

    @objc func printBase64(_ call: CAPPluginCall) {
        guard let data = call.getString("data") else {
            call.reject("data is required")
            return
        }

        guard let mimeType = call.getString("mimeType") else {
            call.reject("mimeType is required")
            return
        }

        let name = call.getString("name") ?? "Document"

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            do {
                try self.implementation.printBase64(
                    data: data,
                    mimeType: mimeType,
                    name: name,
                    presentingViewController: self.bridge?.viewController
                )
                call.resolve()
            } catch {
                call.reject("Failed to print base64 data: \(error.localizedDescription)")
            }
        }
    }

    @objc func printFile(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("path is required")
            return
        }

        let name = call.getString("name") ?? "Document"

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            do {
                try self.implementation.printFile(
                    path: path,
                    name: name,
                    presentingViewController: self.bridge?.viewController
                )
                call.resolve()
            } catch {
                call.reject("Failed to print file: \(error.localizedDescription)")
            }
        }
    }

    @objc func printHtml(_ call: CAPPluginCall) {
        guard let html = call.getString("html") else {
            call.reject("html is required")
            return
        }

        let name = call.getString("name") ?? "Document"

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            do {
                try self.implementation.printHtml(
                    html: html,
                    name: name,
                    presentingViewController: self.bridge?.viewController
                )
                call.resolve()
            } catch {
                call.reject("Failed to print HTML: \(error.localizedDescription)")
            }
        }
    }

    @objc func printPdf(_ call: CAPPluginCall) {
        guard let path = call.getString("path") else {
            call.reject("path is required")
            return
        }

        let name = call.getString("name") ?? "Document"

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }

            do {
                try self.implementation.printPdf(
                    path: path,
                    name: name,
                    presentingViewController: self.bridge?.viewController
                )
                call.resolve()
            } catch {
                call.reject("Failed to print PDF: \(error.localizedDescription)")
            }
        }
    }

    @objc func printWebView(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? "Document"

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            guard let webView = self.bridge?.webView else {
                call.reject("WebView not available")
                return
            }

            do {
                try self.implementation.printWebView(
                    webView: webView,
                    name: name,
                    presentingViewController: self.bridge?.viewController
                )
                call.resolve()
            } catch {
                call.reject("Failed to print web view: \(error.localizedDescription)")
            }
        }
    }

    @objc func getPluginVersion(_ call: CAPPluginCall) {
        call.resolve(["version": self.pluginVersion])
    }
}
