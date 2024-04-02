package eu.viandeendirect.common;

import eu.viandeendirect.model.Sale;
import eu.viandeendirect.domains.sale.SaleRepository;
import eu.viandeendirect.domains.sale.SaleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
class TestJacksonConfiguration {

    @MockBean
    SaleRepository saleRepository;

    @Autowired
    SaleService saleService;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp(WebApplicationContext webApplicationContext) {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void offsetDateTimeAttributes_should_be_serialized_in_iso_format() throws Exception {
        // given
        Sale sale = new Sale();
        sale.setId(0);
        sale.setDeliveryStart(OffsetDateTime.parse("2021-09-30T15:30:00+01:00"));
        Mockito.when(saleRepository.findById(any())).thenReturn(Optional.of(sale));

        // when / then
        mockMvc.perform(get("/sales/0"))
                .andExpect(content().json("""
                        {
                            "id": 0,
                            "deliveryStart": "2021-09-30T15:30:00+01:00"
                        }
                        """));
    }

}