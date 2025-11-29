const http = require('http');

async function testWithNewUser() {
  // Register new user
  console.log('1. Registering new user...');
  const email = `test${Date.now()}@test.com`;
  const registerData = JSON.stringify({ email, password: 'Test123!', name: 'Test User' });
  
  const registerRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': registerData.length },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.write(registerData);
    req.end();
  });

  if (registerRes.status !== 201) {
    console.error('Register falló:', registerRes);
    return;
  }

  const token = registerRes.body.access_token;
  const userId = registerRes.body.id;
  console.log(`✅ Usuario registrado: ID ${userId}`);

  // Try to create medical history for self
  console.log('\n2. Creating medical history for self...');
  const historyData = JSON.stringify({
    patientId: Number(userId),
    condition: 'Test Condition',
    type: 'fisico',
    diagnosis: 'Test diagnosis'
  });

  const historyRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/medical-history',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': historyData.length,
        'Authorization': `Bearer ${token}`
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.write(historyData);
    req.end();
  });

  console.log('\nStatus:', historyRes.status);
  console.log('Response:', JSON.stringify(historyRes.body, null, 2));
  
  if (historyRes.status === 201) {
    console.log('\n✅ ¡Historial médico creado exitosamente!');
  } else {
    console.log('\n❌ Error al crear historial médico');
  }
}

testWithNewUser().catch(console.error);
