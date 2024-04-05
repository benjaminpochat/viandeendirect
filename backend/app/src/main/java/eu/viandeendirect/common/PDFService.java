package eu.viandeendirect.common;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import eu.viandeendirect.model.BeefProduction;
import org.apache.tomcat.util.codec.binary.Base64;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

public abstract class PDFService<T> {
    public ByteArrayOutputStream generatePDF(T arguments) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(getContentAsHtml(arguments), "/");
        builder.toStream(outputStream);
        builder.run();
        return outputStream;
    }

    protected String getTemplate() throws URISyntaxException, IOException {
        return Files.lines(Paths.get(getClass().getClassLoader().getResource(getTemplatePath()).toURI())).collect(Collectors.joining());
    }

    protected String getCSS() throws URISyntaxException, IOException {
        return Files.lines(Paths.get(getClass().getClassLoader().getResource(getCSSPath()).toURI())).collect(Collectors.joining());
    }

    protected abstract String getTemplatePath();

    protected abstract String getCSSPath();

    protected abstract String getContentAsHtml(T argument);

    protected String getViandeEnDirectLogoAsBase64() {
        return getImageAsBase64("images/viande_en_direct.png");
    }

    protected String getLabelRougeLogoAsBase64(BeefProduction beefProduction) {
        if (!beefProduction.getLabelRougeCertified()) {
            return "";
        }
        return getImageAsBase64("images/label_rouge.jpg");
    }

    protected String getImageAsBase64(String filePath) {
        try {
            return Base64.encodeBase64String(getClass().getClassLoader().getResource(filePath).openStream().readAllBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
