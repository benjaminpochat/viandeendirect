package eu.viandeendirect.service;

import eu.viandeendirect.api.PackageTemplatesApiDelegate;
import eu.viandeendirect.model.PackageTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class PackageTemplatesService implements PackageTemplatesApiDelegate {
    @Override
    public ResponseEntity<PackageTemplate> getPackageTemplates() {
        return PackageTemplatesApiDelegate.super.getPackageTemplates();
    }
}
