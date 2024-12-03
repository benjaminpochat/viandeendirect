package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Image;
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

@Schema(name = "PackageTemplate", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "package_templates")
public class PackageTemplate {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "package_template_id_generator")
  @SequenceGenerator(name="package_template_id_generator", sequenceName = "package_template_id_seq", allocationSize = 1)
  private Integer id;

  @JsonProperty("label")
  private String label;

  @JsonProperty("description")
  private String description;

  @JsonIgnore
  @OneToOne(fetch = FetchType.LAZY)
  private Image photo;

  @JsonProperty("netWeight")
  private Float netWeight;

  @JsonProperty("unitPrice")
  private Float unitPrice;

  public PackageTemplate id(Integer id) {
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

  public PackageTemplate photo(Image photo) {
    this.photo = photo;
    return this;
  }

  /**
   * Get photo
   * @return photo
  */
  @Valid
  @Schema(name = "photo", required = false)
  public Image getPhoto() {
    return photo;
  }

  public void setPhoto(Image photo) {
    this.photo = photo;
  }

  public PackageTemplate netWeight(Float netWeight) {
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

  public PackageTemplate unitPrice(Float unitPrice) {
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

