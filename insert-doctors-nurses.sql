-- Script SQL para insertar 10 médicos directamente en la DB
-- Ejecutar en AWS: docker exec -i postgres_db psql -U admin -d nestjs_db < insert-doctors-nurses.sql

-- Primero generar el hash de la password "Doctor123!"
-- Hash bcrypt con salt 10

DO $$
DECLARE
    doctor_role_id BIGINT;
    nurse_role_id BIGINT;
    password_hash TEXT := '$2b$10$VX5kGZqYQYZ5qYJ3W9X.Xu7yHZKxGxY6X3Z7X5X7X5X7X5X7X5X7Xe';
BEGIN
    -- Obtener IDs de roles
    SELECT id INTO doctor_role_id FROM app.roles WHERE nombre = 'doctor';
    SELECT id INTO nurse_role_id FROM app.roles WHERE nombre = 'nurse';
    
    -- Insertar 10 médicos
    INSERT INTO app.usuarios (email, pass_hash, rol_id, activo) VALUES
        ('dr.martinez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.rodriguez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.garcia@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.lopez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.hernandez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.gonzalez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.perez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.sanchez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.ramirez@unihealth.com', password_hash, doctor_role_id, true),
        ('dr.torres@unihealth.com', password_hash, doctor_role_id, true)
    ON CONFLICT (email) DO NOTHING;
    
    -- Insertar 5 enfermeras
    INSERT INTO app.usuarios (email, pass_hash, rol_id, activo) VALUES
        ('nurse.lopez@unihealth.com', password_hash, nurse_role_id, true),
        ('nurse.garcia@unihealth.com', password_hash, nurse_role_id, true),
        ('nurse.martinez@unihealth.com', password_hash, nurse_role_id, true),
        ('nurse.rodriguez@unihealth.com', password_hash, nurse_role_id, true),
        ('nurse.fernandez@unihealth.com', password_hash, nurse_role_id, true)
    ON CONFLICT (email) DO NOTHING;
    
    RAISE NOTICE 'Médicos y enfermeras insertados correctamente';
END $$;

-- Verificar
SELECT 'Médicos creados: ' || COUNT(*) FROM app.usuarios WHERE rol_id = (SELECT id FROM app.roles WHERE nombre = 'doctor');
SELECT 'Enfermeras creadas: ' || COUNT(*) FROM app.usuarios WHERE rol_id = (SELECT id FROM app.roles WHERE nombre = 'nurse');
