package com.mattnovinger.apps.rmnpcamping;

import org.junit.Test;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.StringWriter;

import static org.junit.Assert.*;

public class PdfExtractorTest {

    @Test
    public void testExtract() throws IOException {
        FileInputStream availPdf = new FileInputStream("/Users/mnovinger/personal-projects/rmnp-camping/java-server/src/test/fixtures/campsite_availability_list.pdf");
        StringWriter writer = new StringWriter();
        PdfExtractor pdfExtractor = new PdfExtractor();
        pdfExtractor.extract(availPdf, writer);
        assertEquals(126639, writer.toString().length());
    }

}