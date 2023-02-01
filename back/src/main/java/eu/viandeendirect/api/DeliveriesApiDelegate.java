package eu.viandeendirect.api;

import eu.viandeendirect.model.Delivery;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.annotation.Generated;

/**
 * A delegate to be called by the {@link DeliveriesApiController}}.
 * Implement this interface with a {@link org.springframework.stereotype.Service} annotated class.
 */
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2023-01-29T17:49:01.253242761+01:00[Europe/Paris]")
public interface DeliveriesApiDelegate {

    default Optional<NativeWebRequest> getRequest() {
        return Optional.empty();
    }

    /**
     * GET /deliveries : Get all deliveries
     * Retreive the deliveries available for buying food. The past deliveries are excluded.
     *
     * @return The deliveries are retreived (status code 200)
     * @see DeliveriesApi#deliveriesGet
     */
    default ResponseEntity<List<Delivery>> deliveriesGet() {
        getRequest().ifPresent(request -> {
            for (MediaType mediaType: MediaType.parseMediaTypes(request.getHeader("Accept"))) {
                if (mediaType.isCompatibleWith(MediaType.valueOf("application/json"))) {
                    String exampleString = "{ \"deliveryAddress\" : \"\", \"name\" : \"name\", \"id\" : \"\" }";
                    ApiUtil.setExampleResponse(request, "application/json", exampleString);
                    break;
                }
            }
        });
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

}
