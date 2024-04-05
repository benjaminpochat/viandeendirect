package eu.viandeendirect.domains.production;

import de.redsix.pdfcompare.CompareResult;
import de.redsix.pdfcompare.PdfComparator;
import eu.viandeendirect.model.BeefProduction;
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
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
class TestPackageElementLabelService {

    private static final Logger LOGGER = LoggerFactory.getLogger(TestPackageElementLabelService.class);

    @TempDir
    File outputFolder;

    @Autowired
    PackageElementLabelService service;

    @Test
    void generatePDF_should_produce_a_correct_pdf() throws IOException, URISyntaxException {
        // given
        BeefProduction beefProduction = new BeefProduction();
        beefProduction.setCuttingDate(LocalDate.of(2024, 4, 4));
        beefProduction.setAnimalType(BeefProduction.AnimalTypeEnum.COW);
        beefProduction.setCattleBreed(BeefProduction.CattleBreedEnum.LIMOUSINE);
        beefProduction.setAnimalIdentifier("FR5705563733");
        beefProduction.setLabelRougeCertified(true);

        // when
        ByteArrayOutputStream outputStream = service.generatePDF(new PackageElementLabelService.Arguments(beefProduction, List.of("Bavette (steaks)")));

        // then
        File packageElementLabelFile = new File(outputFolder, "package_element_labels.pdf");
        FileOutputStream fileOutputStream = new FileOutputStream(packageElementLabelFile);
        outputStream.writeTo(fileOutputStream);
        fileOutputStream.flush();
        LOGGER.info(String.format("PDF file at %s", packageElementLabelFile.getAbsolutePath()));
        var expectedProductElementLabelPath = Path.of(ClassLoader.getSystemResource("pdf/expected_package_element_labels.pdf").toURI());
        CompareResult compareResult = new PdfComparator(expectedProductElementLabelPath.toString(), packageElementLabelFile.getAbsolutePath()).compare();
        File compareResultFile = new File(outputFolder, "package_element_labels_compare.pdf");
        compareResult.writeTo(new FileOutputStream(compareResultFile));
        assertThat(compareResult.getDifferences().isEmpty()).isTrue();
    }

}