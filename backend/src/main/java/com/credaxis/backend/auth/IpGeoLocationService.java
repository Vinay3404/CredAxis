package com.credaxis.backend.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class IpGeoLocationService {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${app.geo.enabled:true}")
    private boolean geoEnabled;

    @Value("${app.geo.provider-url:https://ipapi.co/%s/json/}")
    private String geoProviderUrl;

    public IpGeoLocationService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(2))
                .build();
    }

    public IpGeoLocationResult resolve(String ipAddress) {
        if (!geoEnabled || ipAddress == null || ipAddress.isBlank() || isPrivateOrLocalIp(ipAddress)) {
            return IpGeoLocationResult.empty(ipAddress);
        }

        try {
            String endpoint = String.format(geoProviderUrl, ipAddress.trim());
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .timeout(Duration.ofSeconds(3))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return IpGeoLocationResult.empty(ipAddress);
            }

            JsonNode root = objectMapper.readTree(response.body());
            if (root.path("error").asBoolean(false)) {
                return IpGeoLocationResult.empty(ipAddress);
            }

            Double latitude = readDouble(root, "latitude", "lat");
            Double longitude = readDouble(root, "longitude", "lon");
            String country = readText(root, "country_name", "country");
            String region = readText(root, "region", "region_name");
            String city = readText(root, "city");

            return new IpGeoLocationResult(ipAddress, country, region, city, latitude, longitude);
        } catch (Exception ex) {
            return IpGeoLocationResult.empty(ipAddress);
        }
    }

    private Double readDouble(JsonNode root, String... keys) {
        for (String key : keys) {
            JsonNode node = root.path(key);
            if (node.isNumber()) {
                return node.asDouble();
            }
            if (node.isTextual()) {
                try {
                    return Double.parseDouble(node.asText());
                } catch (NumberFormatException ignored) {
                    // continue
                }
            }
        }
        return null;
    }

    private String readText(JsonNode root, String... keys) {
        for (String key : keys) {
            String value = root.path(key).asText(null);
            if (value != null && !value.isBlank() && !"null".equalsIgnoreCase(value)) {
                return value;
            }
        }
        return null;
    }

    private boolean isPrivateOrLocalIp(String ipAddress) {
        String ip = ipAddress.trim();
        return "127.0.0.1".equals(ip)
                || "0:0:0:0:0:0:0:1".equals(ip)
                || "::1".equals(ip)
                || ip.startsWith("10.")
                || ip.startsWith("192.168.")
                || ip.startsWith("172.16.")
                || ip.startsWith("172.17.")
                || ip.startsWith("172.18.")
                || ip.startsWith("172.19.")
                || ip.startsWith("172.2")
                || ip.startsWith("172.30.")
                || ip.startsWith("172.31.");
    }
}
