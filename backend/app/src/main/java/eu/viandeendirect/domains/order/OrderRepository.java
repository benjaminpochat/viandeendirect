package eu.viandeendirect.domains.order;

import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.PackageLot;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends CrudRepository<Order, Integer> {
    @Query("select o from Order o where o.sale.id = :saleId")
    List<Order> findBySaleId(@Param("saleId") Integer saleId);

    @Query("""
            select o
            from Order o
            inner join o.payment p
            where p.checkoutSessionId = :checkoutSessionId""")
    Order findByCheckoutSessionId(@Param("checkoutSessionId") String checkoutSessionId);

}
