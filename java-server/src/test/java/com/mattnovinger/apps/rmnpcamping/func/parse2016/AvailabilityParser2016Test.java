package com.mattnovinger.apps.rmnpcamping.func.parse2016;

import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import org.junit.Test;

import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by mnovinger on 8/5/16.
 */
public class AvailabilityParser2016Test {

    @Test
    public void parseAvailability2016() throws Exception {
        String filename = "./src/test/fixtures/parsed-availability-08-25-2016.txt";
        String allLines = new String(Files.readAllBytes(Paths.get(filename)));
        AvailabilityParser2016 parser = new AvailabilityParser2016();
        List<CampSite> campSites = parser.buildAvailability(allLines);
        assertEquals(139, campSites.size());
        assertEquals(66, campSites.get(10).getAvailability().size());
    }
}