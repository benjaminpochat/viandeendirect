package eu.viandeendirect.domains.order;

import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.OrderItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends CrudRepository<OrderItem, Integer> {
    @Query("SELECT i FROM OrderItem i WHERE i.order = :order")
    List<OrderItem> findByOrder(@Param("order") Order order);
}
