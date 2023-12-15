package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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

@Schema(name = "Invoice", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "invoices")
public class Invoice {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "invoice_id_generator")
  @SequenceGenerator(name="invoice_id_generator", sequenceName = "invoice_id_seq", allocationSize = 1)
  private Integer id;

  public Invoice id(Integer id) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Invoice invoice = (Invoice) o;
    return Objects.equals(this.id, invoice.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Invoice {\n");
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

