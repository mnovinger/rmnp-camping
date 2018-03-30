package com.mattnovinger.apps.rmnpcamping.rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mattnovinger.apps.rmnpcamping.domain.CampSite;
import com.mattnovinger.apps.rmnpcamping.domain.CampsiteAvailabilityResponse;
import com.mattnovinger.apps.rmnpcamping.func.AvailabilityParser;
import com.mattnovinger.apps.rmnpcamping.func.FileFetcher;
import com.mattnovinger.apps.rmnpcamping.func.PdfExtractor;
import com.mattnovinger.apps.rmnpcamping.func.parse2017.AvailabilityParser2017;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Created by mnovinger on 8/22/16.
 */
@RestController
public class AvailabilityGenerator {
    private String cachedAvailabilityJson = null;
    private LocalDateTime lastFetchDate = null;
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    // TODO put a mutex around the fetch
    @RequestMapping(path = "/api/availability", produces = "application/json; charset=UTF-8")
    public String getAvailability() {
        if (cachedAvailabilityJson == null || moreThanSixHoursSinceUpdate(lastFetchDate)) {
            try {
                log.warn("Starting fetching of a new availability file.");
                InputStream pdfFile = FileFetcher.fetchFile();
                log.info("Done fetching new availability file.");
                lastFetchDate = LocalDateTime.now();
                String extractedAvailabilityTest = PdfExtractor.extract(pdfFile);
                log.info("Done extracting availability PDF.");
                AvailabilityParser parser = new AvailabilityParser2017();
                List<CampSite> cachedCampsites = parser.buildAvailability(extractedAvailabilityTest);
                CampsiteAvailabilityResponse response = new CampsiteAvailabilityResponse(cachedCampsites, lastFetchDate.toString());
                Gson gson = new GsonBuilder()
                        .setDateFormat(DateFormat.SHORT, DateFormat.SHORT).create();
                cachedAvailabilityJson = gson.toJson(response);
                log.info("Done parsing new availability file.");
            } catch (IOException e) {
                e.printStackTrace();
                return "{\"msg\":\"error fetching or parsing\"}";
            }
        }

        return cachedAvailabilityJson;
    }

    protected boolean moreThanSixHoursSinceUpdate(LocalDateTime lastFetchDate) {
        return lastFetchDate != null && LocalDateTime.now().isAfter(lastFetchDate.plus(6, ChronoUnit.HOURS));
    }
}
