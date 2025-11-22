export class CreateVitalDto {
  patientId: number;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  tempC?: number;
  spo2?: number;
}
