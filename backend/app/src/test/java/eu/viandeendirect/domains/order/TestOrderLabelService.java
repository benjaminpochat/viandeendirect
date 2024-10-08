package eu.viandeendirect.domains.order;

import de.redsix.pdfcompare.CompareResult;
import de.redsix.pdfcompare.PdfComparator;
import eu.viandeendirect.model.*;
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

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import static eu.viandeendirect.domains.order.OrderTestUtils.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Disabled
public class TestOrderLabelService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TestOrderLabelService.class);

    @TempDir
    File outputFolder;

    @Autowired
    OrderLabelService service;

    @Test
    void generatePDF_should_produce_a_correct_pdf() throws IOException, URISyntaxException {
        // given
        BeefProduction beefProduction = getBeefProduction();

        PackageLot packageLot1 = getPackageLot(1, beefProduction, "Colis tradition", """
                Le colis tradition est composé de :
                - 1 côte de boeuf
                - 1 rosbeef
                - 4 kg de steaks (paquets de 2 ou 4)
                - 2 rotis
                - 1 kg de morceaux à braiser ou à bouillir
                - 3 kg de steaks hachés (paquets de 2 ou 4)
                                
                Les quantités peuvent varier légèrement.
                """, 10f);

        PackageLot packageLot2 = getPackageLot(2, beefProduction, "Filet", """
                Les filets sont vendus à l'unité, pour un poids d'environ 500g.
                Le paiement à la commande est calculé pour un poids de 500g.
                Le prix définitif est calculé après la découpe, à la pesée.
                Le solde est réglé ou remboursé à la livraison en chèque ou espèces.
                """, 0.5f);

        Sale sale = new Sale();
        sale.setDeliveryStart(OffsetDateTime.parse("2021-09-30T15:30:00+01:00"));

        Order order1 = createOrder(123, createCustomer("Valentine", "DURAND", "0601020304"), Map.of(packageLot1, 1, packageLot2, 2));
        Order order2 = createOrder(124, createCustomer("Thibaut", "ENCOSTUME-MONFISS", "0304050607"), Map.of(packageLot1, 2));
        sale.setOrders(List.of(order1, order2));

        // when
        ByteArrayOutputStream outputStream = service.generatePDF(sale);

        // then
        File packageElementLabelFile = new File(outputFolder, "sale_orders_labels.pdf");
        FileOutputStream fileOutputStream = new FileOutputStream(packageElementLabelFile);
        outputStream.writeTo(fileOutputStream);
        fileOutputStream.flush();
        LOGGER.info(String.format("PDF file at %s", packageElementLabelFile.getAbsolutePath()));
        var expectedProductElementLabelPath = Path.of(ClassLoader.getSystemResource("pdf/expected_sale_orders_labels.pdf").toURI());
        CompareResult compareResult = new PdfComparator(expectedProductElementLabelPath.toString(), packageElementLabelFile.getAbsolutePath()).compare();
        File compareResultFile = new File(outputFolder, "sale_orders_labels_compare.pdf");
        compareResult.writeTo(new FileOutputStream(compareResultFile));
        assertThat(compareResult.getDifferences().isEmpty()).isTrue();
    }




}
