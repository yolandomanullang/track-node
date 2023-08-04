const axios = require('axios');
const twilio = require('twilio');
const notifier = require('node-notifier');
const player = require('play-sound')();



// Konfigurasi akun Twilio
const accountSid = 'AC14b5ddcb5f1f2dcddb775c5f050ccd8a';
const authToken = 'b0922bad7d52fe3051fc375465cced53';
const twilioNumber = '+14155238886'; // Nomor WhatsApp yang sudah terverifikasi di Twilio
const targetWhatsAppNumber = '+6282267852621'; // Nomor WhatsApp tujuan

const client = twilio(accountSid, authToken);

const websiteUrl = 'https://pointblank.id/';
const soundFile = './music.mp3'; // Ganti dengan path ke file audio Anda

const MAX_NOTIFICATION_COUNT = 10;
const MAX_WHATSAPP_COUNT = 10;
const STATUS_OK = 200;

let hasPlayedSound = false;
let notificationCount = 0;
let whatsappCount = 0;

function checkWebsiteStatus() {
  axios.get(websiteUrl)
    .then((response) => {
      if (response.status === STATUS_OK) {
        interval = 3000;
        if (!hasPlayedSound) {
          console.log(`Website ${websiteUrl} berhasil dimuat (Status Code: ${STATUS_OK})`);
          playSuccessSound();
          hasPlayedSound = true;
        }

        // Menampilkan notifikasi desktop
        if (notificationCount < MAX_NOTIFICATION_COUNT) {
          console.log(`Website ${websiteUrl} berhasil dimuat (Status Code: ${STATUS_OK})`);
          showDesktopNotification('Website berhasil dimuat');
          notificationCount++;
        }

        // Mengirim pesan WhatsApp
        if (whatsappCount < MAX_WHATSAPP_COUNT) {
          sendWhatsAppMessage('Website berhasil dimuat');
          whatsappCount++;
        }

        if(whatsappCount == MAX_WHATSAPP_COUNT && notificationCount == MAX_NOTIFICATION_COUNT){
            console.log(`Website ${websiteUrl} berhasil dimuat (Status Code: ${STATUS_OK})`);
        }
      } else {
        console.log(`Gagal Broo =>  (Status Code: ${response.status})`);
      }
    })
    .catch((error) => {
      console.error(`Gagal Broo => ${error.message}`);
    });
}

function playSuccessSound() {
  player.play(soundFile, (err) => {
    if (err) {
      console.error(`Gagal memutar suara: ${err}`);
    }
  });
}

function showDesktopNotification(message) {
  notifier.notify({
    title: 'Website Status',
    message: message,
    sound: true,
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
interval = 1000; // 1 detik dalam milisekon
setInterval(checkWebsiteStatus, interval);
