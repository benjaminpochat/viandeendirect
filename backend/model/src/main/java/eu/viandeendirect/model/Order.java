package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Invoice;
import eu.viandeendirect.model.OrderItem;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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

  @JsonProperty("invoice")
  @OneToOne
  private Invoice invoice;

  @JsonProperty("items")
  @jakarta.persistence.OneToMany
  @Valid
  private List<OrderItem> items = null;

  @JsonProperty("customer")
  @ManyToOne
  private Customer customer;

  @JsonProperty("id")
  @jakarta.persistence.Id
  private BigDecimal id;

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

  public Order id(BigDecimal id) {
    this.id = id;
    return this;
  }

  /**
   * 
   * @return id
  */
  @NotNull @Valid 
  @Schema(name = "id", description = "", required = true)
  public BigDecimal getId() {
    return id;
  }

  public void setId(BigDecimal id) {
    this.id = id;
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
    return Objects.equals(this.invoice, order.invoice) &&
        Objects.equals(this.items, order.items) &&
        Objects.equals(this.customer, order.customer) &&
        Objects.equals(this.id, order.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(invoice, items, customer, id);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Order {\n");
    sb.append("    invoice: ").append(toIndentedString(invoice)).append("\n");
    sb.append("    items: ").append(toIndentedString(items)).append("\n");
    sb.append("    customer: ").append(toIndentedString(customer)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
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

