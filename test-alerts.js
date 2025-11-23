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

async function testAlerts() {
  const email = `nurse_alert${Date.now()}@example.com`;
  const password = 'password123';

  console.log('1. Registrando Enfermero:', email);
  const registerRes = await request(
    { hostname: 'localhost', port: 3000, path: '/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email, password, name: 'Nurse Alert' }
  );
  const token = registerRes.body.access_token;
  console.log('✅ Token obtenido.');

  console.log('\n2. Creando Alerta...');
  // Asumimos patientId 1 y typeId 1 existen (seed)
  const alertData = {
    patientId: 1,
    typeId: 1,
    latitude: 40.416775,
    longitude: -3.703790,
    description: 'Paciente caído en pasillo norte'
  };

  const createRes = await request(
    { hostname: 'localhost', port: 3000, path: '/alerts', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    alertData
  );

  if (createRes.status === 201) {
    console.log('✅ Alerta creada. ID:', createRes.body.id);
    console.log('   Estado:', createRes.body.status);
  } else {
    console.error('❌ Fallo crear alerta', createRes.body);
  }

  console.log('\n3. Asignando Alerta...');
  const assignRes = await request(
    { hostname: 'localhost', port: 3000, path: `/alerts/${createRes.body.id}/assign`, method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } },
    {}
  );
  
  if (assignRes.status === 200 && assignRes.body.status === 'en curso') {
    console.log('✅ Alerta asignada y en curso.');
  } else {
    console.error('❌ Fallo asignar alerta', assignRes.body);
  }
}

testAlerts();
