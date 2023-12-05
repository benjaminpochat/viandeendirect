package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Production;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
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

@Schema(name = "Sale", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "sales")
public class Sale {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sale_id_generator")
  @SequenceGenerator(name="sale_id_generator", sequenceName = "sale_id_seq", allocationSize = 1)
  private BigDecimal id;

  @JsonProperty("productions")
  @jakarta.persistence.OneToMany
  @Valid
  private List<Production> productions = null;

  @JsonProperty("orders")
  @jakarta.persistence.OneToMany
  @Valid
  private List<Order> orders = null;

  @JsonProperty("deliveryStart")
  private String deliveryStart;

  @JsonProperty("deliveryStop")
  private String deliveryStop;

  @JsonProperty("deliveryAddressName")
  private String deliveryAddressName;

  @JsonProperty("deliveryAddressLine1")
  private String deliveryAddressLine1;

  @JsonProperty("deliveryAddressLine2")
  private String deliveryAddressLine2;

  @JsonProperty("deliveryCity")
  private String deliveryCity;

  @JsonProperty("deliveryZipCode")
  private String deliveryZipCode;

  public Sale id(BigDecimal id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  */
  @Valid
  @Schema(name = "id", required = false)
  public BigDecimal getId() {
    return id;
  }

  public void setId(BigDecimal id) {
    this.id = id;
  }

  public Sale productions(List<Production> productions) {
    this.productions = productions;
    return this;
  }

  public Sale addProductionsItem(Production productionsItem) {
    if (this.productions == null) {
      this.productions = new ArrayList<>();
    }
    this.productions.add(productionsItem);
    return this;
  }

  /**
   * 
   * @return productions
  */
  @Valid 
  @Schema(name = "productions", description = "", required = false)
  public List<Production> getProductions() {
    return productions;
  }

  public void setProductions(List<Production> productions) {
    this.productions = productions;
  }

  public Sale orders(List<Order> orders) {
    this.orders = orders;
    return this;
  }

  public Sale addOrdersItem(Order ordersItem) {
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

  public Sale deliveryStart(String deliveryStart) {
    this.deliveryStart = deliveryStart;
    return this;
  }

  /**
   *
   * @return deliveryStart
  */

  @Schema(name = "deliveryStart", description = "", required = false)
  public String getDeliveryStart() {
    return deliveryStart;
  }

  public void setDeliveryStart(String deliveryStart) {
    this.deliveryStart = deliveryStart;
  }

  public Sale deliveryStop(String deliveryStop) {
    this.deliveryStop = deliveryStop;
    return this;
  }

  /**
   *
   * @return deliveryStop
  */

  @Schema(name = "deliveryStop", description = "", required = false)
  public String getDeliveryStop() {
    return deliveryStop;
  }

  public void setDeliveryStop(String deliveryStop) {
    this.deliveryStop = deliveryStop;
  }

  public Sale deliveryAddressName(String deliveryAddressName) {
    this.deliveryAddressName = deliveryAddressName;
    return this;
  }

  /**
   * Get deliveryAddressName
   * @return deliveryAddressName
  */

  @Schema(name = "deliveryAddressName", required = false)
  public String getDeliveryAddressName() {
    return deliveryAddressName;
  }

  public void setDeliveryAddressName(String deliveryAddressName) {
    this.deliveryAddressName = deliveryAddressName;
  }

  public Sale deliveryAddressLine1(String deliveryAddressLine1) {
    this.deliveryAddressLine1 = deliveryAddressLine1;
    return this;
  }

  /**
   * Get deliveryAddressLine1
   * @return deliveryAddressLine1
  */

  @Schema(name = "deliveryAddressLine1", required = false)
  public String getDeliveryAddressLine1() {
    return deliveryAddressLine1;
  }

  public void setDeliveryAddressLine1(String deliveryAddressLine1) {
    this.deliveryAddressLine1 = deliveryAddressLine1;
  }

  public Sale deliveryAddressLine2(String deliveryAddressLine2) {
    this.deliveryAddressLine2 = deliveryAddressLine2;
    return this;
  }

  /**
   * Get deliveryAddressLine2
   * @return deliveryAddressLine2
  */

  @Schema(name = "deliveryAddressLine2", required = false)
  public String getDeliveryAddressLine2() {
    return deliveryAddressLine2;
  }

  public void setDeliveryAddressLine2(String deliveryAddressLine2) {
    this.deliveryAddressLine2 = deliveryAddressLine2;
  }

  public Sale deliveryCity(String deliveryCity) {
    this.deliveryCity = deliveryCity;
    return this;
  }

  /**
   * Get deliveryCity
   * @return deliveryCity
  */

  @Schema(name = "deliveryCity", required = false)
  public String getDeliveryCity() {
    return deliveryCity;
  }

  public void setDeliveryCity(String deliveryCity) {
    this.deliveryCity = deliveryCity;
  }

  public Sale deliveryZipCode(String deliveryZipCode) {
    this.deliveryZipCode = deliveryZipCode;
    return this;
  }

  /**
   * Get deliveryZipCode
   * @return deliveryZipCode
  */

  @Schema(name = "deliveryZipCode", required = false)
  public String getDeliveryZipCode() {
    return deliveryZipCode;
  }

  public void setDeliveryZipCode(String deliveryZipCode) {
    this.deliveryZipCode = deliveryZipCode;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Sale sale = (Sale) o;
    return Objects.equals(this.id, sale.id) &&
        Objects.equals(this.productions, sale.productions) &&
        Objects.equals(this.orders, sale.orders) &&
        Objects.equals(this.deliveryStart, sale.deliveryStart) &&
        Objects.equals(this.deliveryStop, sale.deliveryStop) &&
        Objects.equals(this.deliveryAddressName, sale.deliveryAddressName) &&
        Objects.equals(this.deliveryAddressLine1, sale.deliveryAddressLine1) &&
        Objects.equals(this.deliveryAddressLine2, sale.deliveryAddressLine2) &&
        Objects.equals(this.deliveryCity, sale.deliveryCity) &&
        Objects.equals(this.deliveryZipCode, sale.deliveryZipCode);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, productions, orders, deliveryStart, deliveryStop, deliveryAddressName, deliveryAddressLine1, deliveryAddressLine2, deliveryCity, deliveryZipCode);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Sale {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    productions: ").append(toIndentedString(productions)).append("\n");
    sb.append("    orders: ").append(toIndentedString(orders)).append("\n");
    sb.append("    deliveryStart: ").append(toIndentedString(deliveryStart)).append("\n");
    sb.append("    deliveryStop: ").append(toIndentedString(deliveryStop)).append("\n");
    sb.append("    deliveryAddressName: ").append(toIndentedString(deliveryAddressName)).append("\n");
    sb.append("    deliveryAddressLine1: ").append(toIndentedString(deliveryAddressLine1)).append("\n");
    sb.append("    deliveryAddressLine2: ").append(toIndentedString(deliveryAddressLine2)).append("\n");
    sb.append("    deliveryCity: ").append(toIndentedString(deliveryCity)).append("\n");
    sb.append("    deliveryZipCode: ").append(toIndentedString(deliveryZipCode)).append("\n");
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

