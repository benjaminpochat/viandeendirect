package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Order;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
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

@Schema(name = "Delivery", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "deliveries")
public class Delivery {

  @JsonProperty("orders")
  @jakarta.persistence.OneToMany
  @Valid
  private List<Order> orders = null;

  @JsonProperty("start")
  private String start;

  @JsonProperty("stop")
  private String stop;

  @JsonProperty("id")
  @jakarta.persistence.Id
  private BigDecimal id;

  @JsonProperty("name")
  private String name;

  public Delivery orders(List<Order> orders) {
    this.orders = orders;
    return this;
  }

  public Delivery addOrdersItem(Order ordersItem) {
    if (this.orders == null) {
      this.orders = new ArrayList<>();
    }
    this.orders.add(ordersItem);
    return this;
  }

  /**
   * 
   * @return orders
  */
  @Valid 
  @Schema(name = "orders", description = "", required = false)
  public List<Order> getOrders() {
    return orders;
  }

  public void setOrders(List<Order> orders) {
    this.orders = orders;
  }

  public Delivery start(String start) {
    this.start = start;
    return this;
  }

  /**
   * 
   * @return start
  */
  
  @Schema(name = "start", description = "", required = false)
  public String getStart() {
    return start;
  }

  public void setStart(String start) {
    this.start = start;
  }

  public Delivery stop(String stop) {
    this.stop = stop;
    return this;
  }

  /**
   * 
   * @return stop
  */
  
  @Schema(name = "stop", description = "", required = false)
  public String getStop() {
    return stop;
  }

  public void setStop(String stop) {
    this.stop = stop;
  }

  public Delivery id(BigDecimal id) {
    this.id = id;
    return this;
  }

  /**
   * 
   * @return id
  */
  @Valid 
  @Schema(name = "id", description = "", required = false)
  public BigDecimal getId() {
    return id;
  }

  public void setId(BigDecimal id) {
    this.id = id;
  }

  public Delivery name(String name) {
    this.name = name;
    return this;
  }

  /**
   * 
   * @return name
  */
  
  @Schema(name = "name", description = "", required = false)
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Delivery delivery = (Delivery) o;
    return Objects.equals(this.orders, delivery.orders) &&
        Objects.equals(this.start, delivery.start) &&
        Objects.equals(this.stop, delivery.stop) &&
        Objects.equals(this.id, delivery.id) &&
        Objects.equals(this.name, delivery.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(orders, start, stop, id, name);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Delivery {\n");
    sb.append("    orders: ").append(toIndentedString(orders)).append("\n");
    sb.append("    start: ").append(toIndentedString(start)).append("\n");
    sb.append("    stop: ").append(toIndentedString(stop)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
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

