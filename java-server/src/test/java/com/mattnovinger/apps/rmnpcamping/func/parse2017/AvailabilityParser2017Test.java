package com.mattnovinger.apps.rmnpcamping.func.parse2017;

import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.regex.Matcher;

import static org.junit.Assert.*;

/**
 * Created by novma03 on 3/29/17.
 */
public class AvailabilityParser2017Test {
    public static final String ALL_AVAILABILITY_DATA = "./src/test/fixtures/parsed-availability-03-28-2017.txt";
    public static final String SINGLE_AVAILABILITY_DATA = "./src/test/fixtures/availability-example-03-28-2017.txt";
    private AvailabilityParser2017 parser;

    @Before
    public void setUp() {
        parser = new AvailabilityParser2017();
    }

    @Test
    public void testParseAvailability() throws Exception {
        String allLines = getFile(ALL_AVAILABILITY_DATA);
        List<CampSite> availability = parser.buildAvailability(allLines);
        assertEquals(119, availability.size());
        assertEquals("Odessa Lake", availability.get(70).getName());
        assertEquals(189, availability.get(20).getAvailability().size());
    }

    @Test
    public void testParseStatusText() throws IOException {
        String allLines = getFile(SINGLE_AVAILABILITY_DATA);
        List<CampSite> availability = parser.buildAvailability(allLines);
        assertEquals(18, availability.size());

        assertEquals("040", availability.get(3).getId());
        assertEquals("1", availability.get(3).getAvailability().get(5).getStatus());
        assertEquals("FULL", availability.get(3).getAvailability().get(6).getStatus());
    }

    @Test
    public void testSpecialCaseIds() {
        String case1 = "119IS Koenig Stock 5.2 10680 7/13 1 1 1 - - - -";
        Matcher matcher = AvailabilityParser2017.NAME_AND_STATUS_PATTERN.matcher(case1);
        assertTrue(matcher.find());
    }

    private String getFile(String filename) throws IOException {
        return new String(Files.readAllBytes(Paths.get(filename)));
    }


}