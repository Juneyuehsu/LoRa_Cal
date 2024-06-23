new Vue({
  el: '#app',
  data: {
    sf: '7',
    bw: '125',
    cr: '4/5',
    payload_length: '255',
    preamble_length: '8',
    tx_power: '10',
    tx_gain: '0',
    rx_gain: '0',
    frequency: '915',
    noise_figure: '5',
    receiver_sensitivity: '-100',
    ple_environment: [],
    ple_values: {
      '自由空間 (PLE=2)': 2,
      '城市環境 (PLE=3)': 3,
      '室內環境 (PLE=4)': 4,
      '鐵皮屋 (PLE=5)': 5,
      '防爆箱 (PLE=6)': 6,
      '水泥牆 (PLE=6.5)': 6.5,
      '地下室 (PLE=7)': 7
    },
    result: null
  },
  methods: {
    calculate() {
      const ple = this.ple_environment.reduce((total, env) => total + this.ple_values[env], 0);
      
      const params = {
        sf: this.sf,
        bw: this.bw,
        cr: this.cr,
        payload_length: this.payload_length,
        preamble_length: this.preamble_length,
        tx_power: this.tx_power,
        tx_gain: this.tx_gain,
        rx_gain: this.rx_gain,
        frequency: this.frequency,
        noise_figure: this.noise_figure,
        receiver_sensitivity: this.receiver_sensitivity,
        ple: ple
      };

      fetch('/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      .then(response => response.json())
      .then(data => {
        this.result = data;
      });
    }
  },
  template: `
    <div class="container">
      <h2>LoRa 計算器</h2>
      <form @submit.prevent="calculate">
        <div class="form-group">
          <label for="sf">擴頻因子 (SF):</label>
          <select v-model="sf" id="sf">
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>
        <div class="form-group">
          <label for="bw">頻寬 (kHz):</label>
          <input type="number" v-model="bw" id="bw">
        </div>
        <div class="form-group">
          <label for="cr">編碼率 (CR):</label>
          <select v-model="cr" id="cr">
            <option>4/5</option>
            <option>4/6</option>
            <option>4/7</option>
            <option>4/8</option>
          </select>
        </div>
        <div class="form-group">
          <label for="payload_length">有效載荷長度 (字節):</label>
          <input type="number" v-model="payload_length" id="payload_length">
        </div>
        <div class="form-group">
          <label for="preamble_length">前導碼長度 (符號):</label>
          <input type="number" v-model="preamble_length" id="preamble_length">
        </div>
        <div class="form-group">
          <label for="tx_power">發射功率 (dBm):</label>
          <input type="number" v-model="tx_power" id="tx_power">
        </div>
        <div class="form-group">
          <label for="tx_gain">發射天線增益 (dB):</label>
          <input type="number" v-model="tx_gain" id="tx_gain">
        </div>
        <div class="form-group">
          <label for="rx_gain">接收天線增益 (dB):</label>
          <input type="number" v-model="rx_gain" id="rx_gain">
        </div>
        <div class="form-group">
          <label for="frequency">頻率 (MHz):</label>
          <input type="number" v-model="frequency" id="frequency">
        </div>
        <div class="form-group">
          <label for="noise_figure">噪聲指數 (dB):</label>
          <input type="number" v-model="noise_figure" id="noise_figure">
        </div>
        <div class="form-group">
          <label for="receiver_sensitivity">接收靈敏度 (dBm):</label>
          <input type="number" v-model="receiver_sensitivity" id="receiver_sensitivity">
        </div>
        <div class="form-group">
          <label for="ple_environment">環境:</label>
          <div v-for="(value, key) in ple_values" :key="key">
            <input type="checkbox" :value="key" v-model="ple_environment">
            <label>{{ key }}</label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">計算</button>
      </form>
      <div v-if="result">
        <h3>計算結果</h3>
        <p>有效數據速率: {{ result.effective_data_rate.toFixed(3) }} kbps</p>
        <p>空中時間: {{ result.time_on_air.toFixed(3) }} ms</p>
        <p>最大傳輸距離: {{ result.max_distance.toFixed(3) }} km</p>
        <p>接收靈敏度: {{ result.receiver_sensitivity.toFixed(2) }} dBm</p>
      </div>
      <div class="definitions">
        <h4>參數定義</h4>
        <p><strong>擴頻因子 (SF):</strong> LoRa的擴頻因子，範圍為6至12。</p>
        <p><strong>頻寬 (kHz):</strong> LoRa信號的頻寬，單位是千赫茲（kHz）。</p>
        <p><strong>編碼率 (CR):</strong> LoRa的前向糾錯碼率，如4/5、4/6、4/7、4/8。</p>
        <p><strong>有效載荷長度 (字節):</strong> 傳輸數據的有效載荷長度，單位是字節（Byte）。</p>
        <p><strong>前導碼長度 (符號):</strong> 前導碼的長度，單位是符號（Symbols）。</p>
        <p><strong>發射功率 (dBm):</strong> 發射信號的功率，單位是dBm。</p>
        <p><strong>發射天線增益 (dB):</strong> 發射天線的增益，單位是dB。</p>
        <p><strong>接收天線增益 (dB):</strong> 接收天線的增益，單位是dB。</p>
        <p><strong>頻率 (MHz):</strong> 傳輸信號的頻率，單位是兆赫茲（MHz）。</p>
        <p><strong>噪聲指數 (dB):</strong> 接收端的噪聲指數，單位是dB。</p>
        <p><strong>接收靈敏度 (dBm):</strong> 接收端的靈敏度，單位是dBm。</p>
        <p><strong>損耗指數 (PLE):</strong> 傳輸過程中的損耗指數。</p>
      </div>
    </div>
  `
});
