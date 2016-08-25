package com.mattnovinger.apps.rmnpcamping;

import com.mattnovinger.apps.rmnpcamping.rest.AvailabilityGenerator;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

/**
 * Created by mnovinger on 8/23/16.
 */
 @SpringBootApplication
public class App extends SpringBootServletInitializer {
  public static void main(String[] args) {
		    new App()
				.configure(new SpringApplicationBuilder(App.class))
				.run(args);
	}
}
