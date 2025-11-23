const http = require('http');

function request(options, data) {
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testAppointments() {
  const email = `nurse_appt${Date.now()}@example.com`;
  const password = 'password123';

  console.log('1. Registrando Enfermero:', email);
  const registerRes = await request(
    { hostname: 'localhost', port: 3000, path: '/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email, password, name: 'Nurse Appt' }
  );
  const token = registerRes.body.access_token;
  const nurseId = registerRes.body.id; // Necesitamos el ID del enfermero
  console.log('✅ Token obtenido. Nurse ID:', nurseId);

  // Necesitamos un paciente. Usaremos uno existente o crearemos uno rápido si falla.
  // Asumimos patientId 1 existe del seed o tests anteriores.
  const patientId = 1; 

  console.log('\n2. Creando Cita A (10:00 - 11:00)...');
  const apptA = {
    patientId,
    nurseId: Number(nurseId), // El enfermero se asigna a sí mismo o admin asigna
    serviceTypeId: 1,
    start: '2025-12-01T10:00:00Z',
    end: '2025-12-01T11:00:00Z',
    reason: 'Chequeo general'
  };

  const createARes = await request(
    { hostname: 'localhost', port: 3000, path: '/appointments', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    apptA
  );

  if (createARes.status === 201) {
    console.log('✅ Cita A creada.');
  } else {
    console.error('❌ Fallo crear Cita A', createARes.body);
    return;
  }

  console.log('\n3. Intentando crear Cita B (Solapada: 10:30 - 11:30)...');
  const apptB = { ...apptA, start: '2025-12-01T10:30:00Z', end: '2025-12-01T11:30:00Z' };
  
  const createBRes = await request(
    { hostname: 'localhost', port: 3000, path: '/appointments', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    apptB
  );

  if (createBRes.status === 400) {
    console.log('✅ Conflicto detectado correctamente (400 Bad Request).');
  } else {
    console.error('❌ Error: Se permitió cita solapada o error inesperado', createBRes.status, createBRes.body);
  }

  console.log('\n4. Creando Cita C (Sin conflicto: 11:00 - 12:00)...');
  const apptC = { ...apptA, start: '2025-12-01T11:00:00Z', end: '2025-12-01T12:00:00Z' };
  
  const createCRes = await request(
    { hostname: 'localhost', port: 3000, path: '/appointments', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    apptC
  );

  if (createCRes.status === 201) {
    console.log('✅ Cita C creada correctamente.');
  } else {
    console.error('❌ Fallo crear Cita C', createCRes.body);
  }
}

testAppointments();
