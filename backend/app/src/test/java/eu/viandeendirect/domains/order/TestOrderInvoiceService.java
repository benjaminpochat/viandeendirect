package eu.viandeendirect.domains.order;

import de.redsix.pdfcompare.CompareResult;
import de.redsix.pdfcompare.PdfComparator;
import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Sale;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import static eu.viandeendirect.domains.order.OrderTestUtils.*;
import static eu.viandeendirect.domains.order.OrderTestUtils.createCustomer;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Disabled
class TestOrderInvoiceService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TestOrderInvoiceService.class);

    @TempDir
    File outputFolder;

    @Autowired
    OrderInvoiceService service;


    @Test
    void generatePDF_should_produce_a_correct_pdf() throws IOException, URISyntaxException {
        // given
        BeefProduction beefProduction = getBeefProduction();
        PackageLot packageLot1 = getPackageLot(1, beefProduction, "Colis tradition", "Un colis avec plein de trucs délicieux", 10f);
        PackageLot packageLot2 = getPackageLot(2, beefProduction, "Filet", "Un colis avec plein de trucs bons", 0.5f);

        Sale sale = new Sale();
        sale.setId(123);
        sale.setDeliveryStart(OffsetDateTime.parse("2021-09-30T15:30:00+01:00"));

        Order order1 = createOrder(123, createCustomer("Valentine", "DURAND", "0601020304"), Map.of(packageLot1, 1, packageLot2, 2));
        Order order2 = createOrder(124, createCustomer("Thibaut", "ENCOSTUME-MONFISS", "0304050607"), Map.of(packageLot1, 2));
        sale.setOrders(List.of(order1, order2));

        // when
        ByteArrayOutputStream outputStream = service.generatePDF(sale);

        // then
        File packageElementLabelFile = new File(outputFolder, "invoices.pdf");
        FileOutputStream fileOutputStream = new FileOutputStream(packageElementLabelFile);
        outputStream.writeTo(fileOutputStream);
        fileOutputStream.flush();
        LOGGER.info(String.format("PDF file at %s", packageElementLabelFile.getAbsolutePath()));
        var expectedProductElementLabelPath = Path.of(ClassLoader.getSystemResource("pdf/expected_invoices.pdf").toURI());
        CompareResult compareResult = new PdfComparator(expectedProductElementLabelPath.toString(), packageElementLabelFile.getAbsolutePath()).compare();
        File compareResultFile = new File(outputFolder, "invoices_compare.pdf");
        compareResult.writeTo(new FileOutputStream(compareResultFile));
        assertThat(compareResult.getDifferences().isEmpty()).isTrue();
    }

}