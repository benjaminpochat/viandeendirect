package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.GrowerStatus;
import eu.viandeendirect.model.User;
import java.math.BigDecimal;

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

@Schema(name = "Grower", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "growers")
public class Grower {

  @JsonProperty("user")
  @OneToOne
  private User user;

  @JsonProperty("id")
  @jakarta.persistence.Id
  private BigDecimal id;

  @JsonProperty("status")
  private GrowerStatus status;

  @JsonProperty("salesCredits")
  private BigDecimal salesCredits;

  public Grower user(User user) {
    this.user = user;
    return this;
  }

  /**
   * Get user
   * @return user
  */
  @Valid 
  @Schema(name = "user", required = false)
  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Grower id(BigDecimal id) {
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

  public Grower status(GrowerStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
  */
  @Valid 
  @Schema(name = "status", required = false)
  public GrowerStatus getStatus() {
    return status;
  }

  public void setStatus(GrowerStatus status) {
    this.status = status;
  }

  public Grower salesCredits(BigDecimal salesCredits) {
    this.salesCredits = salesCredits;
    return this;
  }

  /**
   * the number of sales available
   * @return salesCredits
  */
  @Valid 
  @Schema(name = "salesCredits", description = "the number of sales available", required = false)
  public BigDecimal getSalesCredits() {
    return salesCredits;
  }

  public void setSalesCredits(BigDecimal salesCredits) {
    this.salesCredits = salesCredits;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Grower grower = (Grower) o;
    return Objects.equals(this.user, grower.user) &&
        Objects.equals(this.id, grower.id) &&
        Objects.equals(this.status, grower.status) &&
        Objects.equals(this.salesCredits, grower.salesCredits);
  }

  @Override
  public int hashCode() {
    return Objects.hash(user, id, status, salesCredits);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Grower {\n");
    sb.append("    user: ").append(toIndentedString(user)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    salesCredits: ").append(toIndentedString(salesCredits)).append("\n");
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

