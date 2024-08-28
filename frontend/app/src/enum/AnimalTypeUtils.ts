import { BeefProductionAnimalTypeEnum } from "@viandeendirect/api/dist/models/BeefProduction";

export class AnimalTypeUtils implements EnumUtils<BeefProductionAnimalTypeEnum> {

  getLabel(animalType: BeefProductionAnimalTypeEnum | undefined, capitalized: boolean = false): string {
    switch (animalType) {
      case BeefProductionAnimalTypeEnum.Cow:
        return capitalized ? 'Vache' : 'vache'
      case BeefProductionAnimalTypeEnum.Heifer:
        return capitalized ? 'Génisse' : 'génisse'
      case BeefProductionAnimalTypeEnum.Veal:
        return capitalized ? 'Veau' : 'veau'
      case BeefProductionAnimalTypeEnum.Bull:
        return capitalized ? 'Taureau' : 'taureau'
      default:
        return ''
    }
  }

  getLabels(): Array<{id, label}> {
    let labels: Array<{id, label}> = []
    for (const [, value] of Object.entries(BeefProductionAnimalTypeEnum)) {
      labels.push({id: value, label: this.getLabel(value)})
    }
    return labels
  }
}
