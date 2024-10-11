package eu.viandeendirect.domains.order;

import eu.viandeendirect.common.PDFService;
import eu.viandeendirect.model.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static eu.viandeendirect.model.OrderStatus.*;

@Service
public class OrderInvoiceService extends PDFService<Sale> {

    private String invoiceTemplate;
    private String invoiceCSS;

    public OrderInvoiceService() throws URISyntaxException, IOException {
        invoiceTemplate = getTemplate();
        invoiceCSS = getCSS();
    }

    @Override
    protected String getTemplatePath() {
        return "html/pdf/invoice_template.html";
    }

    @Override
    protected String getCSSPath() {
        return "html/pdf/invoice_template.css";
    }

    @Override
    protected String getContentAsHtml(Sale sale) {
        var htmlStart = String.format("<html><meta charset=\"UTF-8\"/><head><style type=\"text/css\">%s</style></head><body>", invoiceCSS);
        var htmlEnd = "</body></html>";
        AtomicInteger invoiceIdStart = new AtomicInteger(0);
        return getProducerCustomerOrderItems(sale)
                .map(producerCustomerOrderItems -> getOrderInvoice(producerCustomerOrderItems, sale, invoiceIdStart))
                .collect(Collectors.joining("", htmlStart, htmlEnd));
    }

    Stream<ProducerCustomerOrderItems> getProducerCustomerOrderItems(Sale sale) {
        List<Order> orders = sale.getOrders().stream()
                .filter(order -> List.of(PAYMENT_COMPLETED, BOOKED_WITHOUT_PAYMENT).contains(order.getStatus()))
                .sorted(Comparator.comparing(Order::getId))
                .toList();
        List<ProducerCustomerOrderItems> producerCustomerOrderItems = new ArrayList<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                Customer customer = order.getCustomer();
                Producer producer = item.getPackageLot().getProduction().getProducer();
                var matchingElement = producerCustomerOrderItems.stream().filter(element -> isProducerCustomerOrderItemsMatchingCurrentItem(element, customer, producer)).findFirst();
                if (matchingElement.isPresent()) {
                    var element = matchingElement.get();
                    element.orderItems.add(item);
                } else {
                    var element = new ProducerCustomerOrderItems(producer, customer, new ArrayList<>(List.of(item)));
                    producerCustomerOrderItems.add(element);
                }
            }
        }
        return producerCustomerOrderItems.stream();
    }

    private static boolean isProducerCustomerOrderItemsMatchingCurrentItem(ProducerCustomerOrderItems element, @NotNull @Valid Customer customer, @Valid Producer producer) {
        return customer.equals(element.customer) && producer.equals(element.producer);
    }

    private String getOrderInvoice(ProducerCustomerOrderItems producerCustomerOrderItems, Sale sale, AtomicInteger invoiceId) {
        Producer producer = producerCustomerOrderItems.producer;
        Customer customer = producerCustomerOrderItems.customer;
        List<OrderItem> orderItems = producerCustomerOrderItems.orderItems.stream().sorted(Comparator.comparing(OrderItem::getId)).toList();
        return String.format(invoiceTemplate,
                producer.getLegalName(),
                Stream.of(
                                producer.getAddress().getAddressLine1(),
                                producer.getAddress().getAddressLine2())
                        .filter(addressLine -> addressLine != null && !addressLine.isBlank())
                        .map(element -> "<div>" + element + "</div>")
                        .collect(Collectors.joining()),
                producer.getAddress().getZipCode(),
                producer.getAddress().getCity(),
                producer.getLegalIdentificationNumber(),
                producer.getUser().getPhone(),
                customer.getUser().getFirstName(),
                customer.getUser().getLastName(),
                customer.getUser().getPhone(),
                sale.getId().toString() + "-" + invoiceId.addAndGet(1),
                sale.getDeliveryStart(),
                orderItems.stream().map(item -> String.format("<tr><td>%s</td><td class=\"align-right\">%s</td><td class=\"align-right\">%.2f €</td><td class=\"align-right\">%.2f €</td></tr>",
                        item.getPackageLot().getLabel(),
                        item.getQuantity(),
                        getItemPriceWithoutTax(item),
                        item.getQuantity() * getItemPriceWithoutTax(item))).collect(Collectors.joining()),
                getTotalPriceWithoutTax(orderItems),
                getTotalTax(orderItems),
                getTotalPriceWithTax(orderItems),
                sale.getDeliveryStart(),
                getPayedStampStyleClass(orderItems)
        );
    }

    private double getTotalPriceWithoutTax(List<OrderItem> orderItems) {
        return orderItems.stream()
                .map(item -> getItemPriceWithoutTax(item) * item.getQuantity())
                .mapToDouble(price -> (double) price)
                .sum();
    }

    private double getTotalTax(List<OrderItem> orderItems) {
        return getTotalPriceWithoutTax(orderItems) * 0.055f;
    }

    private Object getTotalPriceWithTax(List<OrderItem> orderItems) {
        return getTotalPriceWithoutTax(orderItems) + getTotalTax(orderItems);
    }

    private float getItemPriceWithoutTax(OrderItem item) {
        return item.getUnitPrice() * item.getPackageLot().getNetWeight() / 1.055f;
    }

    private String getPayedStampStyleClass(List<OrderItem> orderItems) {
        boolean allOrdersPayed = orderItems.stream()
                .map(OrderItem::getOrder)
                .allMatch(order -> (List.of(PAYMENT_COMPLETED, DELIVERED)).contains(order.getStatus()));
        return allOrdersPayed ? "payed" : "not-payed";
    }

    record ProducerCustomerOrderItems(Producer producer, Customer customer, List<OrderItem> orderItems) {
    }
}
