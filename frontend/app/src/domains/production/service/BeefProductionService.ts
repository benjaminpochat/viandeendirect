export class BeefProductionService {
    static getMeatWeight(warmCarcassWeight: number): number {
        return Math.round(warmCarcassWeight / 0.55 * 0.36 || 0 )
    }

    static getLiveWeight(warmCarcassWeight: number): number {
        return Math.round(warmCarcassWeight / 0.55 || 0 )
    }
}