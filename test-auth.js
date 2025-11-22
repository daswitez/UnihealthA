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

async function testAuth() {
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';

  console.log('1. Registrando usuario:', email);
  const registerRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email, password, name: 'Test User' },
  );
  
  if (registerRes.status !== 201) {
    console.error('Fallo el registro', registerRes.body);
    return;
  }
  const token = registerRes.body.access_token;
  console.log('✅ Registro exitoso. Token obtenido.');

  console.log('\n2. Probando acceso protegido SIN token...');
  const protectedFail = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/users',
    method: 'GET',
  });
  console.log('Status (esperado 401):', protectedFail.status);

  console.log('\n3. Probando acceso protegido CON token...');
  const protectedSuccess = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/users',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log('Status (esperado 200):', protectedSuccess.status);
  
  if (protectedSuccess.status === 200) {
    console.log('✅ Acceso protegido verificado!');
  } else {
    console.error('❌ Fallo el acceso protegido');
  }
}

testAuth();
