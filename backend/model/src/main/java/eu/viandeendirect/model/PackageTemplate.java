package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.math.BigDecimal;
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

@Schema(name = "PackageTemplate", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "package_templates")
public class PackageTemplate {

  @JsonProperty("id")
  @jakarta.persistence.Id
  private BigDecimal id;

  @JsonProperty("label")
  private String label;

  @JsonProperty("description")
  private String description;

  @JsonProperty("photo")
  private String photo;

  @JsonProperty("netWeight")
  private BigDecimal netWeight;

  @JsonProperty("unitPrice")
  private BigDecimal unitPrice;

  public PackageTemplate id(BigDecimal id) {
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

  public PackageTemplate label(String label) {
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

  public PackageTemplate description(String description) {
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

  public PackageTemplate photo(String photo) {
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

  public PackageTemplate netWeight(BigDecimal netWeight) {
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

  public PackageTemplate unitPrice(BigDecimal unitPrice) {
    this.unitPrice = unitPrice;
    return this;
  }

  /**
   * Price per unit (weight unit). Must be multiplied by the weight to get the total price for one package. Includes taxes.
   * @return unitPrice
  */
  @Valid 
  @Schema(name = "unitPrice", description = "Price per unit (weight unit). Must be multiplied by the weight to get the total price for one package. Includes taxes.", required = false)
  public BigDecimal getUnitPrice() {
    return unitPrice;
  }

  public void setUnitPrice(BigDecimal unitPrice) {
    this.unitPrice = unitPrice;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    PackageTemplate packageTemplate = (PackageTemplate) o;
    return Objects.equals(this.id, packageTemplate.id) &&
        Objects.equals(this.label, packageTemplate.label) &&
        Objects.equals(this.description, packageTemplate.description) &&
        Objects.equals(this.photo, packageTemplate.photo) &&
        Objects.equals(this.netWeight, packageTemplate.netWeight) &&
        Objects.equals(this.unitPrice, packageTemplate.unitPrice);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, label, description, photo, netWeight, unitPrice);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PackageTemplate {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    label: ").append(toIndentedString(label)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    photo: ").append(toIndentedString(photo)).append("\n");
    sb.append("    netWeight: ").append(toIndentedString(netWeight)).append("\n");
    sb.append("    unitPrice: ").append(toIndentedString(unitPrice)).append("\n");
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

