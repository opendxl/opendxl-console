These JARs are provided to use iText 2.1.7 with the Server Framework's Content Export module.

Between iText 2.0.x and iText 2.1.x there is a binary (but not source) incompatibility that causes
the following server-side exception when exporting, e.g., charts in Internet Explorer:
java.lang.NoSuchMethodError: com.lowagie.text.pdf.BaseFont.getCharBBox(C)[I
	at org.xhtmlrenderer.pdf.ITextFontResolver$FontDescription.setMetricDefaults(ITextFontResolver.java:679)
	at org.xhtmlrenderer.pdf.ITextFontResolver$FontDescription.<init>(ITextFontResolver.java:610)
	at org.xhtmlrenderer.pdf.ITextFontResolver.addCourier(ITextFontResolver.java:410)
	at org.xhtmlrenderer.pdf.ITextFontResolver.createInitialFontMap(ITextFontResolver.java:390)
	at org.xhtmlrenderer.pdf.ITextFontResolver.<init>(ITextFontResolver.java:52)
	at org.xhtmlrenderer.pdf.ITextRenderer.<init>(ITextRenderer.java:115)
	at org.xhtmlrenderer.pdf.ITextRenderer.<init>(ITextRenderer.java:102)
	at com.isomorphic.contentexport.PdfExport.getPdfRenderer(PdfExport.java:275)
	at com.isomorphic.contentexport.PdfExport.getPdfObject(PdfExport.java:78)
	at com.isomorphic.rpc.BuiltinRPC.getPdfObject(BuiltinRPC.java:829)
	...

This is a known issue with the Flying Saucer product that is fixed by using core-renderer-R8-isomorphic.jar,
a recompilation against iText 2.1.7, instead of core-renderer.jar, which is built for use with iText 2.0.8:
http://code.google.com/p/flying-saucer/issues/detail?id=126

To use iText 2.1.7 with the Server Framework, exclude lib/core-renderer.jar and lib/iText-2.0.8.jar
from the application's classpath and instead add lib-iTextAlternate/core-renderer-R8-isomorphic.jar and
lib-iTextAlternate/iText-2.1.7.jar.
