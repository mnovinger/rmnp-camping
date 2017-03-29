package com.mattnovinger.apps.rmnpcamping.func;

import org.junit.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class PdfExtractorTest {

    @Test
    public void testExtractFor2016() throws IOException {
        PdfExtractor pdfExtractor = new PdfExtractor();
        List<String> text = pdfExtractor.extract(Files.newInputStream(Paths.get("./src/test/fixtures/campsite_availability_list-08-25-2016.pdf")));
        assertEquals(2064, text.size());
    }

    @Test
    public void testExtractFor2017() throws IOException {
        PdfExtractor pdfExtractor = new PdfExtractor();
        List<String> text = pdfExtractor.extract(Files.newInputStream(Paths.get("./src/test/fixtures/campsite_availability_list-03-28-2017.pdf")));
        assertEquals("Expected 2064 but got "+text.size(), 10234, text.size());
    }

    private void writeOutput(String filename) {
       PDDocument document = PDDocument.load(Files.newInputStream(Paths.get("./src/test/fixtures/campsite_availability_list.pdf")));
       PDFTextStripper stripper = new PDFTextStripper();
       StringWriter parsed = new StringWriter();
       stripper.writeText(document, parsed);
       IOUtils.closeQuietly(document);
       Files.write(Paths.get("./src/test/fixtures/parsed-availability"), parsed.toString().getBytes());
    }



}