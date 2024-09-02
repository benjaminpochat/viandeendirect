import { ProductionProductionTypeEnum } from "@viandeendirect/api/dist/models";
import { EnumUtils } from "./EnumUtils.ts";

export class ProductionTypeUtils implements EnumUtils<ProductionProductionTypeEnum>{
  getLabel(productionType: ProductionProductionTypeEnum | undefined, capitalized: boolean = false): string {
    switch (productionType) {
      case ProductionProductionTypeEnum.BeefProduction:
        return capitalized ? 'Colis de viande de boeuf' : 'colis de viande de boeuf'
      case ProductionProductionTypeEnum.HonneyProduction:
        return capitalized ? 'Miel' : 'miel'
      default:
        return ''
    }
  }
  getLabels(): Array<{ id: any; label: any; }> {
    let labels: Array<{id, label}> = []
    for (const [, value] of Object.entries(ProductionProductionTypeEnum)) {
      labels.push({id: value, label: this.getLabel(value)})
    }
    return labels
  }
}