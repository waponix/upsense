export type SensorStatusType = SENSOR_HEALTHY | SENSOR_WARNING;

type SENSOR_HEALTHY = 'healthy';
type SENSOR_WARNING = 'warning';

export enum SensorStatus {
    healthy = 'healthy',
    warning = 'warning'
}
