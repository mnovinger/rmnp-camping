package com.mattnovinger.apps.rmnpcamping;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Created by mnovinger on 8/22/16.
 */
public class AvailabilityGenerator {
    private List<CampSite> cachedCampsites;
    public List<CampSite> getAvailability() {

        try {
            InputStream pdfFile = FileFetcher.fetchFile();
            List<String> extractedAvailabilityTest = PdfExtractor.extract(pdfFile);
            cachedCampsites = AvailabilityParser.parseAvailability(extractedAvailabilityTest);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return cachedCampsites;
    }
}
