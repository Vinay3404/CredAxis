package com.credaxis.backend.auth;

public record IpGeoLocationResult(
        String ipAddress,
        String country,
        String region,
        String city,
        Double latitude,
        Double longitude
) {
    public static IpGeoLocationResult empty(String ipAddress) {
        return new IpGeoLocationResult(ipAddress, null, null, null, null, null);
    }
}
