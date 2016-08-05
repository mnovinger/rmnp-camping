package com.mattnovinger.apps.rmnpcamping;

import org.apache.pdfbox.io.IOUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;

public class PdfExtractor {

    public void extract(InputStream pdf, Writer parsed) throws IOException {
        PDDocument document = PDDocument.load(pdf);
        PDFTextStripper stripper = new PDFTextStripper();

        stripper.writeText(document, parsed);

        IOUtils.closeQuietly(document);

    }
}
