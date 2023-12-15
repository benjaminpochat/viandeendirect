package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Invoice;
import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.model.Sale;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * 
 */

@Schema(name = "Order", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "orders")
public class Order {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_id_generator")
  @SequenceGenerator(name="order_id_generator", sequenceName = "order_id_seq", allocationSize = 1)
  private Integer id;

  @JsonProperty("invoice")
  @OneToOne
  private Invoice invoice;

  @JsonProperty("items")
  @jakarta.persistence.OneToMany(mappedBy = "order")
  @Valid
  private List<OrderItem> items = null;

  @JsonProperty("customer")
  @ManyToOne
  private Customer customer;

  @JsonProperty("sale")
  @ManyToOne
  private Sale sale;

  public Order id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   *
   * @return id
  */
  @NotNull
  @Schema(name = "id", description = "", required = true)
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Order invoice(Invoice invoice) {
    this.invoice = invoice;
    return this;
  }

  /**
   * Get invoice
   * @return invoice
  */
  @Valid 
  @Schema(name = "invoice", required = false)
  public Invoice getInvoice() {
    return invoice;
  }

  public void setInvoice(Invoice invoice) {
    this.invoice = invoice;
  }

  public Order items(List<OrderItem> items) {
    this.items = items;
    return this;
  }

  public Order addItemsItem(OrderItem itemsItem) {
    if (this.items == null) {
      this.items = new ArrayList<>();
    }
    this.items.add(itemsItem);
    return this;
  }

  /**
   * 
   * @return items
  */
  @Valid 
  @Schema(name = "items", description = "", required = false)
  public List<OrderItem> getItems() {
    return items;
  }

  public void setItems(List<OrderItem> items) {
    items.stream().forEach(item -> item.setOrder(this));
    this.items = items;
  }

  public Order customer(Customer customer) {
    this.customer = customer;
    return this;
  }

  /**
   * Get customer
   * @return customer
  */
  @NotNull @Valid 
  @Schema(name = "customer", required = true)
  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public Order sale(Sale sale) {
    this.sale = sale;
    return this;
  }

  /**
   * Get sale
   * @return sale
  */
  @Valid
  @Schema(name = "sale", required = false)
  public Sale getSale() {
    return sale;
  }

  public void setSale(Sale sale) {
    this.sale = sale;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Order order = (Order) o;
    return Objects.equals(this.id, order.id) &&
        Objects.equals(this.invoice, order.invoice) &&
        Objects.equals(this.items, order.items) &&
        Objects.equals(this.customer, order.customer) &&
        Objects.equals(this.sale, order.sale);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, invoice, items, customer, sale);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Order {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    invoice: ").append(toIndentedString(invoice)).append("\n");
    sb.append("    items: ").append(toIndentedString(items)).append("\n");
    sb.append("    customer: ").append(toIndentedString(customer)).append("\n");
    sb.append("    sale: ").append(toIndentedString(sale)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

