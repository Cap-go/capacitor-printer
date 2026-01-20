// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorPrinter",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapgoCapacitorPrinter",
            targets: ["PrinterPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "PrinterPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/PrinterPlugin"),
        .testTarget(
            name: "PrinterPluginTests",
            dependencies: ["PrinterPlugin"],
            path: "ios/Tests/PrinterPluginTests")
    ]
)
