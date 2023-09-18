package eu.viandeendirect.service;

import eu.viandeendirect.api.ProductionsApiDelegate;
import eu.viandeendirect.model.Production;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProductionsService implements ProductionsApiDelegate {
    @Override
    public ResponseEntity<Void> createProduction(Production production) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
