package com.mattnovinger.apps.rmnpcamping;

import com.mattnovinger.apps.rmnpcamping.rest.AvailabilityGenerator;

import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;

@Component
public class JerseyConfig extends ResourceConfig {
	public JerseyConfig() {
		register(AvailabilityGenerator.class);
	}
}
