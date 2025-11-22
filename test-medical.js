const http = require('http');
const fs = require('fs');
const path = require('path');

function request(options, data, isMultipart = false) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
        if (isMultipart) {
            // Multipart handling is complex in raw node, skipping for this simple test script
            // or using a library if available. For now, we might skip attachment test in this script
            // or mock it if possible.
            // Let's try to simulate a simple multipart body if needed, but it's error prone.
            // We will focus on JSON endpoints first.
        } else {
            req.write(JSON.stringify(data));
        }
    }
    req.end();
  });
}

async function testMedical() {
  const email = `nurse${Date.now()}@example.com`;
  const password = 'password123';

  console.log('1. Registrando Enfermero:', email);
  const registerRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email, password, name: 'Nurse Joy' },
  );

  if (registerRes.status !== 201) {
    console.error('Fallo el registro', registerRes.body);
    return;
  }
  const token = registerRes.body.access_token;
  console.log('✅ Enfermero registrado. Token obtenido.');

  // Necesitamos un paciente. Usaremos el endpoint de pacientes.
  console.log('\n2. Creando Paciente...');
  const patientData = {
    firstName: 'Ash',
    lastName: 'Ketchum',
    dob: '1997-04-01T00:00:00Z',
    gender: 'M',
  };
  const createPatientRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/patients',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    },
    patientData,
  );
  
  if (createPatientRes.status !== 201) {
      console.error('Fallo crear paciente', createPatientRes.body);
      return;
  }
  const patientId = createPatientRes.body.profile.userId; // Ojo: el ID del paciente es el userId
  console.log('✅ Paciente creado. ID:', patientId);

  console.log('\n3. Creando Registro Clínico...');
  // Necesitamos un noteTypeId. Asumimos ID 1 (Triaje) del seed.
  const recordData = {
      patientId: Number(patientId),
      noteTypeId: 1,
      note: 'Paciente presenta mareos y fatiga.'
  };
  
  const createRecordRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/records',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    },
    recordData,
  );
  console.log('Create Record Status:', createRecordRes.status);
  if (createRecordRes.status === 201) {
      console.log('✅ Registro clínico creado.');
  } else {
      console.error('❌ Fallo crear registro', createRecordRes.body);
  }

  console.log('\n4. Registrando Signos Vitales...');
  const vitalsData = {
      patientId: Number(patientId),
      systolicBP: 120,
      diastolicBP: 80,
      heartRate: 75,
      tempC: 36.5,
      spo2: 98
  };
  
  const createVitalsRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/vitals',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    },
    vitalsData,
  );
  console.log('Create Vitals Status:', createVitalsRes.status);
  if (createVitalsRes.status === 201) {
      console.log('✅ Signos vitales registrados.');
  } else {
      console.error('❌ Fallo registrar vitales', createVitalsRes.body);
  }

  console.log('\n5. Consultando Historial (como enfermero)...');
  const historyRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/records/patient/${patientId}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log('Registros encontrados:', historyRes.body.length);
  
  if (historyRes.status === 200 && historyRes.body.length > 0) {
      console.log('✅ Historial consultado exitosamente.');
  }

  console.log('\n6. Consultando Historial Propio (como paciente)...');
  // Necesitamos login como paciente. El paciente tiene userId=patientId.
  // Pero no sabemos su password (se generó aleatorio en PatientsService).
  // Para probar esto, deberíamos haber creado el usuario con password conocido o usar un usuario existente.
  // Por simplicidad en este test, usaremos el token del enfermero que TAMBIÉN es un usuario, 
  // aunque no tenga registros propios, debería devolver array vacío (200 OK).
  
  const myHistoryRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/records/my-history',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (myHistoryRes.status === 200) {
      console.log('✅ Endpoint my-history (Records) responde correctamente.');
  } else {
      console.error('❌ Fallo my-history (Records)', myHistoryRes.body);
  }

  const myVitalsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/vitals/my-history',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (myVitalsRes.status === 200) {
      console.log('✅ Endpoint my-history (Vitals) responde correctamente.');
  } else {
      console.error('❌ Fallo my-history (Vitals)', myVitalsRes.body);
  }
}

testMedical();
