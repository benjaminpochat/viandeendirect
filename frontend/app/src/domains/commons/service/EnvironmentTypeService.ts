export class EnvironmentTypeService {

    environmentType: {label: String, color: String} | undefined = undefined

    async getEnvironmentType() {
        if (!this.environmentType) {
            await this.loadEnvironmentType()
        }
        return this.environmentType        
    }

    private async loadEnvironmentType() {
        if (process.env.REACT_APP_MOCK_API) {
            this.environmentType = {label: 'MOCK', color: 'red'}
        } else {
            let response = await fetch(window.location.origin + '/config/viandeendirect.json')
            let config = await response.json()
            this.environmentType = {label: config.environmentTypeLabel, color: config.environmentTypeColor}
        }
    }
}