package com.mattnovinger.apps.rmnpcamping;

import org.apache.pdfbox.io.IOUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PdfExtractor {

    public List<String> extract(InputStream pdf) throws IOException {
        PDDocument document = PDDocument.load(pdf);
        PDFTextStripper stripper = new PDFTextStripper();
        StringWriter parsed = new StringWriter();
        stripper.writeText(document, parsed);
        IOUtils.closeQuietly(document);

        return Arrays.asList(parsed.toString().split("\n"));
    }
}
