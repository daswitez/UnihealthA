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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testPatients() {
  const email = `doc${Date.now()}@example.com`;
  const password = 'password123';

  console.log('1. Registrando Doctor:', email);
  const registerRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email, password, name: 'Dr. House' },
  );

  if (registerRes.status !== 201) {
    console.error('Fallo el registro', registerRes.body);
    return;
  }
  const token = registerRes.body.access_token;
  console.log('✅ Doctor registrado. Token obtenido.');

  console.log('\n2. Creando Paciente...');
  const patientData = {
    firstName: 'John',
    lastName: 'Doe',
    dob: '1990-01-01T00:00:00Z',
    gender: 'Male',
    phone: '555-1234'
  };

  const createRes = await request(
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
  console.log('Create Status:', createRes.status);
  console.log('Patient:', createRes.body);
  
  if (createRes.status !== 201) {
    console.error('❌ Fallo crear paciente');
    return;
  }
  const patientId = createRes.body.id;

  console.log('\n3. Listando Pacientes...');
  const listRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/patients',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log('Pacientes encontrados:', listRes.body.length);

  console.log('\n4. Actualizando Paciente...');
  const updateRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/patients/${patientId}`,
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    },
    { firstName: 'Jonathan' },
  );
  console.log('Update Status:', updateRes.status);
  console.log('Updated Name:', updateRes.body.firstName);

  console.log('\n5. Eliminando Paciente...');
  const deleteRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/patients/${patientId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log('Delete Status:', deleteRes.status);
  
  if (deleteRes.status === 200) {
    console.log('✅ Flujo de Pacientes completado exitosamente!');
  }
}

testPatients();
