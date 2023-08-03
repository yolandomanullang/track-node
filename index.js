const axios = require('axios');
const cheerio = require('cheerio');
const twilio = require('twilio');
const notifier = require('node-notifier');

// Konfigurasi akun Twilio
const accountSid = 'AC14b5ddcb5f1f2dcddb775c5f050ccd8a';
const authToken = '28c43f283814d7a0dd6ddf6123efde4f';
const twilioNumber = '+14155238886'; // Nomor WhatsApp yang sudah terverifikasi di Twilio
const targetWhatsAppNumber = '+6282267852621'; // Nomor WhatsApp tujuan

const client = twilio(accountSid, authToken);

const websiteUrl = 'https://pandang.istanapresiden.go.id/';

function checkWebsiteStatus() {
  axios.get(websiteUrl)
    .then((response) => {
      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const targetText = "INI MERUPAKAN VERSI UNTUK UJI COBA SEBELUM LAUNCHING";
        if ($('#targetElementId').text().includes(targetText)) {
          console.log("Belum bisa daftar. Informasi: INI MERUPAKAN VERSI UNTUK UJI COBA SEBELUM LAUNCHING");
        } else {
          console.log(`Website ${websiteUrl} berhasil dimuat (Status Code: 200)`);
          showDesktopNotification('Website berhasil dimuat');
          sendWhatsAppMessage('Website berhasil dimuat');
        }
      } else {
        console.log(`Gagal Broo =>  (Status Code: ${response.status})`);
      }
    })
    .catch((error) => {
      console.error(`Gagal Broo => ${error.message}`);
    });
}

function showDesktopNotification(message) {
  notifier.notify({
    title: 'Website Status',
    message: message,
    sound: true,
    wait: true,
  });
}

function sendWhatsAppMessage(message) {
  client.messages.create({
    body: message,
    from: `whatsapp:${twilioNumber}`,
    to: `whatsapp:${targetWhatsAppNumber}`
  })
  .then(message => console.log(`Pesan WhatsApp berhasil dikirim dengan SID: ${message.sid}`))
  .catch(error => console.error(`Gagal mengirim pesan WhatsApp: ${error.message}`));
}

// Mulai memeriksa setiap 1 detik
const interval = 2000; // 1 detik dalam milisekon
setInterval(checkWebsiteStatus, interval);