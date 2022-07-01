const axios = require('axios')
axios.post('https://api2.bybit.com/s1/wsot2022/squad/rank', {
  data: {
    "config_id": "1",
    "metric_type": "SQUAD_PROFIT_RATIO",
    "page": 1,
    "page_size": 100
  },
  headers: {
    'Content-Type': 'application/json',
  }
}).then(response => console.log(response.data))