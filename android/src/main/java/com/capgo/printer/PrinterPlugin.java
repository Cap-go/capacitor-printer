package com.capgo.printer;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Printer")
public class PrinterPlugin extends Plugin {

    private final String pluginVersion = "8.0.4";

    private Printer implementation;

    @Override
    public void load() {
        implementation = new Printer(getContext(), getActivity());
    }

    @PluginMethod
    public void printBase64(PluginCall call) {
        String data = call.getString("data");
        String mimeType = call.getString("mimeType");
        String name = call.getString("name", "Document");

        if (data == null) {
            call.reject("data is required");
            return;
        }

        if (mimeType == null) {
            call.reject("mimeType is required");
            return;
        }

        try {
            implementation.printBase64(data, mimeType, name);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to print base64 data: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void printFile(PluginCall call) {
        String path = call.getString("path");
        String mimeType = call.getString("mimeType");
        String name = call.getString("name", "Document");

        if (path == null) {
            call.reject("path is required");
            return;
        }

        try {
            implementation.printFile(path, mimeType, name);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to print file: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void printHtml(PluginCall call) {
        String html = call.getString("html");
        String name = call.getString("name", "Document");

        if (html == null) {
            call.reject("html is required");
            return;
        }

        try {
            implementation.printHtml(html, name);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to print HTML: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void printPdf(PluginCall call) {
        String path = call.getString("path");
        String name = call.getString("name", "Document");

        if (path == null) {
            call.reject("path is required");
            return;
        }

        try {
            implementation.printPdf(path, name);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to print PDF: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void printWebView(PluginCall call) {
        String name = call.getString("name", "Document");

        try {
            implementation.printWebView(getBridge().getWebView(), name);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to print web view: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void getPluginVersion(final PluginCall call) {
        try {
            final JSObject ret = new JSObject();
            ret.put("version", this.pluginVersion);
            call.resolve(ret);
        } catch (final Exception e) {
            call.reject("Could not get plugin version", e);
        }
    }
}
