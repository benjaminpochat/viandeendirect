package eu.viandeendirect.domains.production;

import eu.viandeendirect.api.PackageTemplatesApiDelegate;
import eu.viandeendirect.model.Image;
import eu.viandeendirect.model.PackageTemplate;
import eu.viandeendirect.domains.production.PackageTemplateRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.springframework.http.HttpStatus.OK;

@Service
public class PackageTemplateService implements PackageTemplatesApiDelegate {

    @Autowired
    PackageTemplateRepository packageTemplateRepository;

    @Override
    public ResponseEntity<List<PackageTemplate>> getPackageTemplates() {
        List<PackageTemplate> packageTemplates = new ArrayList<>();
        packageTemplateRepository.findAll().forEach(packageTemplates::add);
        return new ResponseEntity<>(packageTemplates, OK);
    }

    @Override
    public ResponseEntity<Image> getPackageTemplatePhoto(Integer templateId) {
        PackageTemplate packageTemplate = packageTemplateRepository.findById(templateId).get();
        Image photo = Hibernate.unproxy(packageTemplate.getPhoto(), Image.class);
        return new ResponseEntity<>(Objects.requireNonNullElseGet(photo, Image::new), OK);
    }
}
