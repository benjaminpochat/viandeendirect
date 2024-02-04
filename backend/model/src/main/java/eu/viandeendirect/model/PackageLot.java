package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Production;

import jakarta.persistence.ManyToOne;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * A lot of packages
 */

@Schema(name = "PackageLot", description = "A lot of packages")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity
@jakarta.persistence.Table(name = "package_lots")
public class PackageLot {

  @JsonProperty("id")
  @jakarta.persistence.Id
  private Integer id;

  @JsonProperty("production")
  @ManyToOne
  @JsonIgnore
  private Production production;

  @JsonProperty("label")
  private String label;

  @JsonProperty("description")
  private String description;

  @JsonProperty("photo")
  private String photo;

  @JsonProperty("netWeight")
  private Float netWeight;

  @JsonProperty("unitPrice")
  private Float unitPrice;

  @JsonProperty("quantity")
  private Integer quantity;

  @JsonProperty("quantitySold")
  private Integer quantitySold;

  public PackageLot id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  */

  @Schema(name = "id", required = false)
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public PackageLot production(Production production) {
    this.production = production;
    return this;
  }

  /**
   * Get production
   * @return production
  */
  @Valid
  @Schema(name = "production", required = false)
  public Production getProduction() {
    return production;
  }

  public void setProduction(Production production) {
    this.production = production;
  }

  public PackageLot label(String label) {
    this.label = label;
    return this;
  }

  /**
   * Short label of the package template
   * @return label
  */
  
  @Schema(name = "label", description = "Short label of the package template", required = false)
  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public PackageLot description(String description) {
    this.description = description;
    return this;
  }

  /**
   * Long description of the package template
   * @return description
  */
  
  @Schema(name = "description", description = "Long description of the package template", required = false)
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public PackageLot photo(String photo) {
    this.photo = photo;
    return this;
  }

  /**
   * The photo of the package template, encoded as base64
   * @return photo
  */
  
  @Schema(name = "photo", description = "The photo of the package template, encoded as base64", required = false)
  public String getPhoto() {
    return photo;
  }

  public void setPhoto(String photo) {
    this.photo = photo;
  }

  public PackageLot netWeight(Float netWeight) {
    this.netWeight = netWeight;
    return this;
  }

  /**
   * 
   * @return netWeight
  */

  @Schema(name = "netWeight", description = "", required = false)
  public Float getNetWeight() {
    return netWeight;
  }

  public void setNetWeight(Float netWeight) {
    this.netWeight = netWeight;
  }

  public PackageLot unitPrice(Float unitPrice) {
    this.unitPrice = unitPrice;
    return this;
  }

  /**
   * Price per unit (weight unit). Must be multiplied by the weight to get the total price for one package. Includes taxes.
   * @return unitPrice
  */

  @Schema(name = "unitPrice", description = "Price per unit (weight unit). Must be multiplied by the weight to get the total price for one package. Includes taxes.", required = false)
  public Float getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(Float unitPrice) {
    this.unitPrice = unitPrice;
  }

  public PackageLot quantity(Integer quantity) {
    this.quantity = quantity;
    return this;
  }

  /**
   * the quantity of packages for this batch initially on sale
   * @return quantity
  */

  @Schema(name = "quantity", description = "the quantity of packages for this batch initially on sale", required = false)
  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  public PackageLot quantitySold(Integer quantitySold) {
    this.quantitySold = quantitySold;
    return this;
  }

  /**
   * the quantity of packages for this batch already sold
   * @return quantitySold
  */

  @Schema(name = "quantitySold", description = "the quantity of packages for this batch already sold", required = false)
  public Integer getQuantitySold() {
    return quantitySold;
  }

  public void setQuantitySold(Integer quantitySold) {
    this.quantitySold = quantitySold;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    PackageLot packageLot = (PackageLot) o;
    return Objects.equals(this.id, packageLot.id) &&
        Objects.equals(this.production, packageLot.production) &&
        Objects.equals(this.label, packageLot.label) &&
        Objects.equals(this.description, packageLot.description) &&
        Objects.equals(this.photo, packageLot.photo) &&
        Objects.equals(this.netWeight, packageLot.netWeight) &&
        Objects.equals(this.unitPrice, packageLot.unitPrice) &&
        Objects.equals(this.quantity, packageLot.quantity) &&
        Objects.equals(this.quantitySold, packageLot.quantitySold);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, production, label, description, photo, netWeight, unitPrice, quantity, quantitySold);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PackageLot {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    production: ").append(toIndentedString(production)).append("\n");
    sb.append("    label: ").append(toIndentedString(label)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    photo: ").append(toIndentedString(photo)).append("\n");
    sb.append("    netWeight: ").append(toIndentedString(netWeight)).append("\n");
    sb.append("    unitPrice: ").append(toIndentedString(unitPrice)).append("\n");
    sb.append("    quantity: ").append(toIndentedString(quantity)).append("\n");
    sb.append("    quantitySold: ").append(toIndentedString(quantitySold)).append("\n");
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

