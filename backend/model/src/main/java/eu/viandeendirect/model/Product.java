package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.math.BigDecimal;
import java.util.Arrays;
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

@Schema(name = "Product", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "products")
public class Product {

  @JsonProperty("description")
  private String description;

  @JsonProperty("netWeight")
  private BigDecimal netWeight;

  @JsonProperty("unitPrice")
  private JsonNullable<Object> unitPrice = JsonNullable.undefined();

  @JsonProperty("id")
  @jakarta.persistence.Id
  private BigDecimal id;

  public Product description(String description) {
    this.description = description;
    return this;
  }

  /**
   * 
   * @return description
  */
  
  @Schema(name = "description", description = "", required = false)
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Product netWeight(BigDecimal netWeight) {
    this.netWeight = netWeight;
    return this;
  }

  /**
   * 
   * @return netWeight
  */
  @Valid 
  @Schema(name = "netWeight", description = "", required = false)
  public BigDecimal getNetWeight() {
    return netWeight;
  }

  public void setNetWeight(BigDecimal netWeight) {
    this.netWeight = netWeight;
  }

  public Product unitPrice(Object unitPrice) {
    this.unitPrice = JsonNullable.of(unitPrice);
    return this;
  }

  /**
   * Price per unit (weight unit). Must be multiplied by the weight to get the total price for one product. Includes taxes.
   * @return unitPrice
  */
  
  @Schema(name = "unitPrice", description = "Price per unit (weight unit). Must be multiplied by the weight to get the total price for one product. Includes taxes.", required = false)
  public JsonNullable<Object> getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(JsonNullable<Object> unitPrice) {
    this.unitPrice = unitPrice;
  }

  public Product id(BigDecimal id) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Product product = (Product) o;
    return Objects.equals(this.description, product.description) &&
        Objects.equals(this.netWeight, product.netWeight) &&
        equalsNullable(this.unitPrice, product.unitPrice) &&
        Objects.equals(this.id, product.id);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(description, netWeight, hashCodeNullable(unitPrice), id);
  }

  private static <T> int hashCodeNullable(JsonNullable<T> a) {
    if (a == null) {
      return 1;
    }
    return a.isPresent() ? Arrays.deepHashCode(new Object[]{a.get()}) : 31;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Product {\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    netWeight: ").append(toIndentedString(netWeight)).append("\n");
    sb.append("    unitPrice: ").append(toIndentedString(unitPrice)).append("\n");
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

