export class CreatePatientDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob: string; // Recibiremos fecha como string ISO
  gender: string;
}
