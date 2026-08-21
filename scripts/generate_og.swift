import AppKit

let width = 1200
let height = 630
let image = NSImage(size: NSSize(width: width, height: height))

image.lockFocus()

NSColor(calibratedRed: 241 / 255, green: 238 / 255, blue: 230 / 255, alpha: 1).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: width, height: height)).fill()

let ink = NSColor(calibratedRed: 18 / 255, green: 18 / 255, blue: 16 / 255, alpha: 1)
let muted = NSColor(calibratedRed: 113 / 255, green: 111 / 255, blue: 104 / 255, alpha: 1)
let accent = NSColor(calibratedRed: 213 / 255, green: 75 / 255, blue: 56 / 255, alpha: 1)

ink.setStroke()
let rules = NSBezierPath()
rules.lineWidth = 2
rules.move(to: NSPoint(x: 64, y: 568))
rules.line(to: NSPoint(x: 1136, y: 568))
rules.move(to: NSPoint(x: 64, y: 62))
rules.line(to: NSPoint(x: 1136, y: 62))
rules.stroke()

func draw(_ text: String, x: CGFloat, y: CGFloat, font: NSFont, color: NSColor, kern: CGFloat = 0) {
    let attributes: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: color,
        .kern: kern
    ]
    text.draw(at: NSPoint(x: x, y: y), withAttributes: attributes)
}

let mono = NSFont.monospacedSystemFont(ofSize: 18, weight: .regular)
let title = NSFont.systemFont(ofSize: 106, weight: .medium)

draw("IRUAGARU / INDEPENDENT WEB TOOLS", x: 66, y: 520, font: mono, color: muted, kern: 2)
draw("制作のそばに置く、", x: 58, y: 306, font: title, color: ink, kern: -6)
draw("小さな道具。", x: 58, y: 184, font: title, color: ink, kern: -6)
draw("PHOTO / IMAGE / WRITING / PDF", x: 66, y: 90, font: NSFont.monospacedSystemFont(ofSize: 17, weight: .regular), color: muted, kern: 1.5)

accent.setFill()
NSBezierPath(ovalIn: NSRect(x: 1075, y: 94, width: 26, height: 26)).fill()

image.unlockFocus()

guard let tiff = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let png = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("Unable to encode OG image")
}

let output = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
    .appendingPathComponent("assets/og.png")
try png.write(to: output)
