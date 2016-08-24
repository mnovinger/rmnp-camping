package com.mattnovinger.apps.rmnpcamping;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;

@Configuration
@EnableAutoConfiguration
public class ServletConfig {
    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer() {
        return (container -> {
            String envPort = System.getenv("PORT");
            if (StringUtils.isEmpty(envPort)) {
                envPort = "8182";
            }
            container.setPort(Integer.valueOf(envPort));
        });
    }

//
//
//    public class AppConfig {
//
//        @Bean
//        public EmbeddedServletContainerFactory servletContainer() {
//            TomcatEmbeddedServletContainerFactory factory = new TomcatEmbeddedServletContainerFactory();
//            factory.setPort(9000);
//            factory.setSessionTimeout(10, TimeUnit.MINUTES);
//            factory.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/notfound.html"));
//            return factory;
//        }
//
//    }
}
