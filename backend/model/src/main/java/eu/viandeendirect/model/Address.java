package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.Producer;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * an address for delivering orders
 */

@Schema(name = "Address", description = "an address for delivering orders")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity
@jakarta.persistence.Table(name = "addresses")
public class Address {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "address_id_generator")
  @SequenceGenerator(name="address_id_generator", sequenceName = "address_id_seq", allocationSize = 1)
  private Integer id;

  @JsonProperty("name")
  private String name;

  @JsonProperty("city")
  private String city;

  @JsonProperty("addressLine1")
  private String addressLine1;

  @JsonProperty("addressLine2")
  private String addressLine2;

  @JsonProperty("zipCode")
  private String zipCode;

  @JsonProperty("owner")
  @ManyToOne
  private Producer owner;

  public Address id(Integer id) {
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

  public Address name(String name) {
    this.name = name;
    return this;
  }

  /**
   * the name of the address
   * @return name
  */
  
  @Schema(name = "name", description = "the name of the address", required = false)
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Address city(String city) {
    this.city = city;
    return this;
  }

  /**
   * Get city
   * @return city
  */
  
  @Schema(name = "city", required = false)
  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public Address addressLine1(String addressLine1) {
    this.addressLine1 = addressLine1;
    return this;
  }

  /**
   * Get addressLine1
   * @return addressLine1
  */
  
  @Schema(name = "addressLine1", required = false)
  public String getAddressLine1() {
    return addressLine1;
  }

  public void setAddressLine1(String addressLine1) {
    this.addressLine1 = addressLine1;
  }

  public Address addressLine2(String addressLine2) {
    this.addressLine2 = addressLine2;
    return this;
  }

  /**
   * Get addressLine2
   * @return addressLine2
  */
  
  @Schema(name = "addressLine2", required = false)
  public String getAddressLine2() {
    return addressLine2;
  }

  public void setAddressLine2(String addressLine2) {
    this.addressLine2 = addressLine2;
  }

  public Address zipCode(String zipCode) {
    this.zipCode = zipCode;
    return this;
  }

  /**
   * Get zipCode
   * @return zipCode
  */
  
  @Schema(name = "zipCode", required = false)
  public String getZipCode() {
    return zipCode;
  }

  public void setZipCode(String zipCode) {
    this.zipCode = zipCode;
  }

  public Address owner(Producer owner) {
    this.owner = owner;
    return this;
  }

  /**
   * Get owner
   * @return owner
  */
  @Valid 
  @Schema(name = "owner", required = false)
  public Producer getOwner() {
    return owner;
  }

  public void setOwner(Producer owner) {
    this.owner = owner;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Address address = (Address) o;
    return Objects.equals(this.id, address.id) &&
        Objects.equals(this.name, address.name) &&
        Objects.equals(this.city, address.city) &&
        Objects.equals(this.addressLine1, address.addressLine1) &&
        Objects.equals(this.addressLine2, address.addressLine2) &&
        Objects.equals(this.zipCode, address.zipCode) &&
        Objects.equals(this.owner, address.owner);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, city, addressLine1, addressLine2, zipCode, owner);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Address {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    city: ").append(toIndentedString(city)).append("\n");
    sb.append("    addressLine1: ").append(toIndentedString(addressLine1)).append("\n");
    sb.append("    addressLine2: ").append(toIndentedString(addressLine2)).append("\n");
    sb.append("    zipCode: ").append(toIndentedString(zipCode)).append("\n");
    sb.append("    owner: ").append(toIndentedString(owner)).append("\n");
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

