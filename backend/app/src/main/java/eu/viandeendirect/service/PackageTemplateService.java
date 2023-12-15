package eu.viandeendirect.service;

import eu.viandeendirect.api.PackageTemplatesApiDelegate;
import eu.viandeendirect.model.PackageTemplate;
import eu.viandeendirect.repository.PackageTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@Service
public class PackageTemplateService implements PackageTemplatesApiDelegate {

    @Autowired
    PackageTemplateRepository packageTemplateRepository;

    @Override
    public ResponseEntity<List<PackageTemplate>> getPackageTemplates() {
        List<PackageTemplate> packageTemplates = new ArrayList<>();
        packageTemplateRepository.findAll().forEach(packageTemplates::add);
        return new ResponseEntity<>(new ArrayList<>(packageTemplates), OK);
    }
}
