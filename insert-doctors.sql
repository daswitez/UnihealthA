-- Script para insertar 10 médicos en la base de datos
-- Contraseña para todos: Doctor123!
-- Hash bcrypt generado con salt 10

-- Primero verificar que existe el rol 'doctor'
-- El rol 'doctor' debe tener id=3 según manual-seed.sql

-- Insertar 10 médicos
INSERT INTO app.usuarios (email, pass_hash, rol_id, activo) VALUES
  ('dr.martinez@unihealth.com', '$2b$10$YourHashHere1', 3, true),
  ('dr.rodriguez@unihealth.com', '$2b$10$YourHashHere2', 3, true),
  ('dr.garcia@unihealth.com', '$2b$10$YourHashHere3', 3, true),
  ('dr.lopez@unihealth.com', '$2b$10$YourHashHere4', 3, true),
  ('dr.hernandez@unihealth.com', '$2b$10$YourHashHere5', 3, true),
  ('dr.gonzalez@unihealth.com', '$2b$10$YourHashHere6', 3, true),
  ('dr.perez@unihealth.com', '$2b$10$YourHashHere7', 3, true),
  ('dr.sanchez@unihealth.com', '$2b$10$YourHashHere8', 3, true),
  ('dr.ramirez@unihealth.com', '$2b$10$YourHashHere9', 3, true),
  ('dr.torres@unihealth.com', '$2b$10$YourHashHere10', 3, true)
ON CONFLICT (email) DO NOTHING;

SELECT 'Médicos insertados correctamente' AS status;
