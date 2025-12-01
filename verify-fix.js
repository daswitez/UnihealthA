const axios = require('axios');

async function testRegister() {
  try {
    const response = await axios.post('http://localhost:3000/auth/register', {
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User'
    });
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testRegister();
