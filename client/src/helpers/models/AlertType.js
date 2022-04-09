export default class AlertType {

    constructor(message, severity) {
        this.severity = severity || 'info'; //Based on Material-ui Alert Tag severities: error / warning / info / success
        this.message = message || '';       //String message you want the user to see
    }

}