package com.bodegacore.controller;

import com.bodegacore.dto.DashboardDTO;
import com.bodegacore.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller serving high-level executive dashboard metrics,
 * portfolio valuation, and status breakdown.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Retrieves aggregated warehouse inventory metrics, total monetary valuation,
     * availability rate, and preventive maintenance recommendations.
     */
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboardMetrics() {
        return ResponseEntity.ok(dashboardService.getDashboardMetrics());
    }
}
