export enum AnimalType {
  BeefCow = 'BEEF_COW',
  BeefHeifer = 'BEEF_HEIFER',
  BeefBull = 'BEEF_BULL',
  BeefVeal = 'BEEF_VEAL'
}

export class AnimalTypeUtils {
  static getAnimalTypeLabel(animalType: AnimalType) {
    switch (animalType) {
      case AnimalType.BeefCow:
        return 'Vache';
      case AnimalType.BeefHeifer:
        return 'Génisse';
      case AnimalType.BeefBull:
        return 'Taureau';
      case AnimalType.BeefVeal:
        return 'Veau';
      default:
        return '';
    }
  }

}