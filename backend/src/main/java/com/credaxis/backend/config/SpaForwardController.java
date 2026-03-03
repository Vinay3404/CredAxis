package com.credaxis.backend.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({"/", "/sign-in", "/log-in", "/contact-admin", "/dashboard"})
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
