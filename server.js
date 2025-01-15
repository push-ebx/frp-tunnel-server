const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.get('/generate-subdomain', async (req, res) => {
  const {subdomain} = req.query;
  const cfApiKey = process.env.CF_API_KEY;
  const zoneID = process.env.DNS_ZONE_ID;

  try {
    const response = await axios.post(`https://api.cloudflare.com/client/v4/zones/${zoneID}/dns_records`, {
      type: 'A',
      name: subdomain,
      content: process.env.SERVER_IP,
      ttl: 120,
      proxied: true
    }, {
      headers: {
        'Authorization': `Bearer ${cfApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`subdomain ${subdomain} has been created`);
    res.json({success: true, data: response.data});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
