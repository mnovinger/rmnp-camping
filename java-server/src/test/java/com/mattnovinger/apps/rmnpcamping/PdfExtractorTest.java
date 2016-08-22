package com.mattnovinger.apps.rmnpcamping;

import org.junit.Test;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.*;

public class PdfExtractorTest {

    @Test
    public void testExtract() throws IOException {
        PdfExtractor pdfExtractor = new PdfExtractor();
        List<String> text = pdfExtractor.extract(Files.newInputStream(Paths.get("./src/test/fixtures/campsite_availability_list.pdf")));
        assertEquals(3097, text.size());
    }

}