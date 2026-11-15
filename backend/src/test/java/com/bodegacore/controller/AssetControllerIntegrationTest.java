package com.bodegacore.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.bodegacore.dto.AssetCreateDTO;
import com.bodegacore.model.AssetCategory;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for AssetController REST API endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AssetControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("AC-02: POST /api/assets creates an asset returning 201 Created and location header")
    void testCreateAssetSuccess201() throws Exception {
        AssetCreateDTO dto = new AssetCreateDTO(
            "ACT-INT-999",
            "Estación Soldadura Hakko FX-888D",
            AssetCategory.HERRAMIENTAS,
            "Hakko",
            "FX-888D",
            "SN-HK-999",
            "Pasillo B - Estante 5",
            new BigDecimal("680000.00"),
            LocalDate.now().minusMonths(1),
            LocalDate.now().minusDays(5)
        );

        mockMvc.perform(post("/api/assets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(jsonPath("$.assetTag", is("ACT-INT-999")))
            .andExpect(jsonPath("$.status", is("DISPONIBLE")))
            .andExpect(jsonPath("$.acquisitionCost", is(680000.00)));
    }

    @Test
    @DisplayName("AC-03: POST /api/assets with negative cost or blank tag returns 400 Bad Request")
    void testCreateAssetValidationErrors400() throws Exception {
        AssetCreateDTO invalidDto = new AssetCreateDTO(
            "", // Blank tag
            "Equipo Inválido",
            AssetCategory.COMPUTO,
            "Generic",
            "Model-X",
            "SN-000",
            "Pasillo X",
            new BigDecimal("-50.00"), // Invalid negative cost
            LocalDate.now(),
            LocalDate.now()
        );

        mockMvc.perform(post("/api/assets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.title", containsString("Validation Error")))
            .andExpect(jsonPath("$.invalidFields.assetTag").exists())
            .andExpect(jsonPath("$.invalidFields.acquisitionCost").exists());
    }

    @Test
    @DisplayName("AC-06 / P04: GET /api/assets?olderThan90Days=true returns only assets with inspection > 90 days")
    void testFilterByAntiquityOlderThan90Days() throws Exception {
        mockMvc.perform(get("/api/assets")
                .param("olderThan90Days", "true"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(4))))
            .andExpect(jsonPath("$[0].olderThan90Days", is(true)));
    }

    @Test
    @DisplayName("AC-06 / P03: GET /api/assets?critical=true returns assets currently in maintenance")
    void testFilterByStatusCriticalMaintenance() throws Exception {
        mockMvc.perform(get("/api/assets")
                .param("critical", "true"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(3)))
            .andExpect(jsonPath("$[0].status", is("EN_MANTENIMIENTO")));
    }
}
