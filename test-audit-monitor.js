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

async function testAuditAndMonitor() {
  const email = `admin_audit${Date.now()}@example.com`;
  const password = 'password123';

  console.log('1. Registrando Admin:', email);
  const registerRes = await request(
    { hostname: 'localhost', port: 3000, path: '/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email, password, name: 'Admin Audit' }
  );
  const token = registerRes.body.access_token;
  const userId = registerRes.body.id;
  console.log('✅ Token obtenido.');

  console.log('\n2. Creando Alerta (Debe generar AuditLog)...');
  const alertData = {
    patientId: 1,
    typeId: 1,
    latitude: 10.0,
    longitude: 10.0,
    description: 'Test Audit'
  };

  const createRes = await request(
    { hostname: 'localhost', port: 3000, path: '/alerts', method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    alertData
  );

  if (createRes.status === 201) {
    console.log('✅ Alerta creada.');
  } else {
    console.error('❌ Fallo crear alerta', createRes.body);
    return;
  }

  // Verificar AuditLog (No tenemos endpoint público de audit, pero podemos verificar si el servidor no explotó y si podemos leer parámetros)
  
  console.log('\n3. Probando Parámetros (Crear/Leer)...');
  const paramKey = `TEST_PARAM_${Date.now()}`;
  const updateParamRes = await request(
    { hostname: 'localhost', port: 3000, path: `/parameters/${paramKey}`, method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } },
    { value: 'Test Value' }
  );

  if (updateParamRes.status === 200 || updateParamRes.status === 201) {
    console.log('✅ Parámetro creado/actualizado.');
  } else {
    console.error('❌ Fallo actualizar parámetro', updateParamRes.body);
  }

  const getParamRes = await request(
    { hostname: 'localhost', port: 3000, path: `/parameters/${paramKey}`, method: 'GET', headers: { 'Authorization': `Bearer ${token}` } },
    {}
  );

  if (getParamRes.status === 200 && getParamRes.body.value === 'Test Value') {
    console.log('✅ Parámetro leído correctamente.');
  } else {
    console.error('❌ Fallo leer parámetro', getParamRes.body);
  }

  console.log('\n4. Verificando Bull Board (GET /admin/queues)...');
  const boardRes = await request(
    { hostname: 'localhost', port: 3000, path: '/admin/queues', method: 'GET' },
    {}
  );

  if (boardRes.status === 200 || boardRes.status === 301 || boardRes.status === 302) {
    console.log('✅ Bull Board accesible (Status code ok).');
  } else {
    console.error('❌ Fallo acceder a Bull Board', boardRes.status);
  }
}

testAuditAndMonitor();
