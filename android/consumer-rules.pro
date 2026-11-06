# Consumer rules for apps that enable R8 (Capacitor 9 release defaults).
# Duplicate of library proguard-rules.pro content, merged into app shrinkers via consumerProguardFiles.

# Capacitor discovers @CapacitorPlugin classes and @PluginMethod handlers via reflection on the JS bridge.
-keep @com.getcapacitor.annotation.CapacitorPlugin public class com.capgo.printer.PrinterPlugin {
    @com.getcapacitor.PluginMethod public <methods>;
}

# Printer and its inner PrintDocumentAdapter implementations (PDF and content URI paths). Kept with the public constructor used from PrinterPlugin.
-keep class com.capgo.printer.Printer {
    <init>(android.content.Context, android.app.Activity);
    public <methods>;
}
-keep class com.capgo.printer.Printer$* {
    <init>(...);
    <methods>;
}
