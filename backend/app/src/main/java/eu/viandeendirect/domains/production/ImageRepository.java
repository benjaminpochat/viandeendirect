package eu.viandeendirect.domains.production;

import eu.viandeendirect.model.Image;
import org.springframework.data.repository.CrudRepository;

public interface ImageRepository extends CrudRepository<Image, Integer> {
}
