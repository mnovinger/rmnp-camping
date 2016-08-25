package com.mattnovinger.apps.rmnpcamping.rest;

import org.junit.Test;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import static org.junit.Assert.*;

/**
 * Created by mnovinger on 8/25/16.
 */
public class AvailabilityGeneratorTest {
    @Test
    public void testSixHourCheck() {
        LocalDateTime sevenHoursAgo = LocalDateTime.now().minus(7, ChronoUnit.HOURS);
        AvailabilityGenerator generator = new AvailabilityGenerator();
        assertTrue(generator.moreThanSixHoursSinceUpdate(sevenHoursAgo));
    }

}