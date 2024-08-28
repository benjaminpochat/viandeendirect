interface EnumUtils<Enum> {
    getLabel(enumValue: Enum | undefined, capitalized: boolean): string

    getLabels(): Array<{id, label}>
}