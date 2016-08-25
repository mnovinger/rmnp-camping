package com.mattnovinger.apps.rmnpcamping.func;

import org.junit.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class PdfExtractorTest {

    @Test
    public void testExtract() throws IOException {
        PdfExtractor pdfExtractor = new PdfExtractor();
        List<String> text = pdfExtractor.extract(Files.newInputStream(Paths.get("./src/test/fixtures/campsite_availability_list.pdf")));
        assertEquals(2064, text.size());


//        PDDocument document = PDDocument.load(Files.newInputStream(Paths.get("./src/test/fixtures/campsite_availability_list.pdf")));
//        PDFTextStripper stripper = new PDFTextStripper();
//        StringWriter parsed = new StringWriter();
//        stripper.writeText(document, parsed);
//        IOUtils.closeQuietly(document);
//        Files.write(Paths.get("./src/test/fixtures/parsed-availability"), parsed.toString().getBytes());
    }

}