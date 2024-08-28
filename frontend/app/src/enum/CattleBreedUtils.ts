import { BeefProductionCattleBreedEnum } from "@viandeendirect/api/dist/models/BeefProduction"

export class CattleBreedUtils implements EnumUtils<BeefProductionCattleBreedEnum> {

  getLabel(cattleBreed: BeefProductionCattleBreedEnum | undefined, capitalized: boolean = false): string {
    switch (cattleBreed) {
      case BeefProductionCattleBreedEnum.Charolaise:
        return capitalized ? 'Charolaise' : 'charolaise'
      case BeefProductionCattleBreedEnum.Limousine:
        return capitalized ? 'Limousine' : 'limousine'
      default:
        return ''
    }
  }

  getLabels(): Array<{ id, label }> {
    let labels: Array<{ id, label }> = []
    for (const [, value] of Object.entries(BeefProductionCattleBreedEnum)) {
      labels.push({ id: value, label: this.getLabel(value) })
    }
    return labels
  }
}
