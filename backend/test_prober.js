import axios from 'axios';

async function testProber() {
  try {
    const res = await axios.post('http://localhost:5000/scan-url', {
      url: 'http://localhost:5000/metrics'
    });
    console.log('✅ Prober Test Success:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('❌ Prober Test Failed:', err.message);
  }
}

testProber();
