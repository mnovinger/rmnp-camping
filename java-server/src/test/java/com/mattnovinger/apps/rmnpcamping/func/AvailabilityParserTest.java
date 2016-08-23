package com.mattnovinger.apps.rmnpcamping.func;

import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.func.AvailabilityParser;
import org.junit.Test;

import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by mnovinger on 8/5/16.
 */
public class AvailabilityParserTest {

    @Test
    public void parseAvailability() throws Exception {
        List<String> allLines = Files.readAllLines(Paths.get("./src/test/fixtures/parsed-availability.txt"), Charset.defaultCharset());
        AvailabilityParser parser = new AvailabilityParser();
        List<CampSite> campSites = parser.parseAvailability(allLines);
        assertEquals(139, campSites.size());
        assertEquals(114, campSites.get(10).getAvailability().size());
    }
}