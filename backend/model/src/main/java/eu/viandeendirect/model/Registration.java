package eu.viandeendirect.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.util.Objects;

/**
 * the registration of new producer
 */

@Schema(name = "Registration", description = "the registration of new producer")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
public class Registration {

  @JsonProperty("producer")
  private Producer producer;

  @JsonProperty("productionDescription")
  private String productionDescription;

  public Registration producer(Producer producer) {
    this.producer = producer;
    return this;
  }

  /**
   * Get producer
   * @return producer
  */
  @Valid 
  @Schema(name = "producer", required = false)
  public Producer getProducer() {
    return producer;
  }

  public void setProducer(Producer producer) {
    this.producer = producer;
  }

  public Registration productionDescription(String productionDescription) {
    this.productionDescription = productionDescription;
    return this;
  }

  /**
   * Get productionDescription
   * @return productionDescription
  */
  
  @Schema(name = "productionDescription", required = false)
  public String getProductionDescription() {
    return productionDescription;
  }

  public void setProductionDescription(String productionDescription) {
    this.productionDescription = productionDescription;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Registration registration = (Registration) o;
    return Objects.equals(this.producer, registration.producer) &&
        Objects.equals(this.productionDescription, registration.productionDescription);
  }

  @Override
  public int hashCode() {
    return Objects.hash(producer, productionDescription);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Registration {\n");
    sb.append("    producer: ").append(toIndentedString(producer)).append("\n");
    sb.append("    productionDescription: ").append(toIndentedString(productionDescription)).append("\n");
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

