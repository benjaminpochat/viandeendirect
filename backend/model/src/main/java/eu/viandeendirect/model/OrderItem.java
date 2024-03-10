package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.PackageLot;
import java.util.Arrays;

import jakarta.persistence.*;
import org.openapitools.jackson.nullable.JsonNullable;
import java.util.NoSuchElementException;
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

@Schema(name = "OrderItem", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "orderItems")
public class OrderItem {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_item_id_generator")
  @SequenceGenerator(name="order_item_id_generator", sequenceName = "order_item_id_seq", allocationSize = 1)
  private Integer id;

  @JsonProperty("order")
  @ManyToOne
  @JsonIgnore
  private Order order;

  @JsonProperty("packageLot")
  @ManyToOne
  private PackageLot packageLot;

  @JsonProperty("unitPrice")
  private Float unitPrice;

  @JsonProperty("quantity")
  private Integer quantity;

  public OrderItem id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   *
   * @return id
  */

  @Schema(name = "id", description = "", required = false)
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public OrderItem order(Order order) {
    this.order = order;
    return this;
  }

  /**
   * Get order
   * @return order
  */
  @Valid
  @Schema(name = "order", required = false)
  public Order getOrder() {
    return order;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public OrderItem packageLot(PackageLot packageLot) {
    this.packageLot = packageLot;
    return this;
  }

  /**
   * Get packageLot
   * @return packageLot
  */
  @Valid
  @Schema(name = "packageLot", required = false)
  public PackageLot getPackageLot() {
    return packageLot;
  }

  public void setPackageLot(PackageLot packageLot) {
    this.packageLot = packageLot;
  }

  public OrderItem unitPrice(Float unitPrice) {
    this.unitPrice = unitPrice;
    return this;
  }

  /**
   * Price per unit ordered. Must be multiplied per quantity to get the total price. Includes taxes.
   * @return unitPrice
  */

  @Schema(name = "unitPrice", description = "Price per unit ordered. Must be multiplied per quantity to get the total price. Includes taxes.", required = false)
  public Float getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(Float unitPrice) {
    this.unitPrice = unitPrice;
  }

  public OrderItem quantity(Integer quantity) {
    this.quantity = quantity;
    return this;
  }

  /**
   * 
   * @return quantity
  */

  @Schema(name = "quantity", description = "", required = false)
  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OrderItem orderItem = (OrderItem) o;
    return Objects.equals(this.id, orderItem.id) &&
        Objects.equals(this.order, orderItem.order) &&
        Objects.equals(this.packageLot, orderItem.packageLot) &&
        Objects.equals(this.unitPrice, orderItem.unitPrice) &&
        Objects.equals(this.quantity, orderItem.quantity);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, order, packageLot, unitPrice, quantity);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class OrderItem {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    order: ").append(toIndentedString(order)).append("\n");
    sb.append("    packageLot: ").append(toIndentedString(packageLot)).append("\n");
    sb.append("    unitPrice: ").append(toIndentedString(unitPrice)).append("\n");
    sb.append("    quantity: ").append(toIndentedString(quantity)).append("\n");
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

