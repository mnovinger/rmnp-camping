package com.mattnovinger.apps.rmnpcamping;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.IOException;
import java.io.InputStream;

public class FileFetcher {
    private static final String AVAILABILITY_URL = "https://www.nps.gov/webcams-romo/campsite_availability_list.pdf";

    public static InputStream fetchFile() throws IOException {
        HttpClient httpclient = new DefaultHttpClient();
        HttpGet httpget = new HttpGet(AVAILABILITY_URL);
        HttpResponse response = httpclient.execute(httpget);
        HttpEntity entity = response.getEntity();
        if (entity != null) {
            return entity.getContent();
        } else {
            throw new RuntimeException("No File at URL "+AVAILABILITY_URL);
        }
    }
}
