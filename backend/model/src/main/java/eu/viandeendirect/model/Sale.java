package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Delivery;
import eu.viandeendirect.model.Production;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

@Schema(name = "Sale", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "sales")
public class Sale {

  @JsonProperty("productions")
  @jakarta.persistence.OneToMany
  @Valid
  private List<Production> productions = null;

  @JsonProperty("delivery")
  @OneToOne
  private Delivery delivery;

  @JsonProperty("id")
  @jakarta.persistence.Id
  private BigDecimal id;

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

  public Sale delivery(Delivery delivery) {
    this.delivery = delivery;
    return this;
  }

  /**
   * Get delivery
   * @return delivery
  */
  @Valid 
  @Schema(name = "delivery", required = false)
  public Delivery getDelivery() {
    return delivery;
  }

  public void setDelivery(Delivery delivery) {
    this.delivery = delivery;
  }

  public Sale id(BigDecimal id) {
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
    Sale sale = (Sale) o;
    return Objects.equals(this.productions, sale.productions) &&
        Objects.equals(this.delivery, sale.delivery) &&
        Objects.equals(this.id, sale.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(productions, delivery, id);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Sale {\n");
    sb.append("    productions: ").append(toIndentedString(productions)).append("\n");
    sb.append("    delivery: ").append(toIndentedString(delivery)).append("\n");
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

