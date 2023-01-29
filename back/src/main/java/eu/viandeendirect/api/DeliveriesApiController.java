package eu.viandeendirect.api;

import eu.viandeendirect.model.Delivery;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.annotation.Generated;

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2023-01-29T16:21:14.967495596+01:00[Europe/Paris]")
@Controller
@RequestMapping("${openapi.viandeendirectEu.base-path:}")
public class DeliveriesApiController implements DeliveriesApi {

    private final DeliveriesApiDelegate delegate;

    public DeliveriesApiController(@Autowired(required = false) DeliveriesApiDelegate delegate) {
        this.delegate = Optional.ofNullable(delegate).orElse(new DeliveriesApiDelegate() {});
    }

    @Override
    public DeliveriesApiDelegate getDelegate() {
        return delegate;
    }

}
