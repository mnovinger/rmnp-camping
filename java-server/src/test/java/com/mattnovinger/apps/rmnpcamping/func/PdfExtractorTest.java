package com.mattnovinger.apps.rmnpcamping.func;

import org.apache.pdfbox.io.IOUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.Test;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class PdfExtractorTest {

    @Test
    public void testExtractFor2016() throws IOException {
        PdfExtractor pdfExtractor = new PdfExtractor();
        String fileName = "./src/test/fixtures/campsite_availability_list-08-25-2016.pdf";
        String text = pdfExtractor.extract(Files.newInputStream(Paths.get(fileName)));
        assertEquals(76310, text.length());
    }

    @Test
    public void testExtractFor2017() throws IOException {
        PdfExtractor pdfExtractor = new PdfExtractor();
        String fileName = "./src/test/fixtures/campsite_availability_list-03-28-2017.pdf";
        String text = pdfExtractor.extract(Files.newInputStream(Paths.get(fileName)));
        assertEquals(288889, text.length());
        writeOutput(fileName, "parsed-availability-03-28-2017.txt");
    }

    private void writeOutput(String filename, String outputFilename) throws IOException {
        PDDocument document = PDDocument.load(Files.newInputStream(Paths.get(filename)));
        PDFTextStripper stripper = new PDFTextStripper();
        StringWriter parsed = new StringWriter();
        stripper.writeText(document, parsed);
        IOUtils.closeQuietly(document);
        Files.write(Paths.get("./src/test/fixtures/" + outputFilename), parsed.toString().getBytes());
    }


}