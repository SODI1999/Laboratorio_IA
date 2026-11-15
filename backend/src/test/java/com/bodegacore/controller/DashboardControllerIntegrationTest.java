package com.bodegacore.controller;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration test for DashboardController verifying aggregated KPIs,
 * total valuation, and recommendations.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class DashboardControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("AC-05 / P01, P06: GET /api/dashboard returns metrics, valuation and recommendations")
    void testGetDashboardMetrics() throws Exception {
        mockMvc.perform(get("/api/dashboard"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalAssets", is(20)))
            .andExpect(jsonPath("$.totalValuation", greaterThan(0.0)))
            .andExpect(jsonPath("$.statusDistribution.DISPONIBLE", is(10)))
            .andExpect(jsonPath("$.statusDistribution.ASIGNADO", is(6)))
            .andExpect(jsonPath("$.statusDistribution.EN_MANTENIMIENTO", is(3)))
            .andExpect(jsonPath("$.statusDistribution.DE_BAJA", is(1)))
            .andExpect(jsonPath("$.olderThan90DaysCount", greaterThanOrEqualTo(4)))
            .andExpect(jsonPath("$.recommendations").isArray());
    }
}
