const randomize = require('randomatic');
const QRCode = require('qrcode');
const codeSet = new Set();

async function generate(evoucherId: number, qty: number) {
  while (codeSet.size != qty) {
    const code = `${randomize('A', 6)}${evoucherId}${randomize(
      '0',
      5 - `${evoucherId}`.length,
    )}`;
    codeSet.add(code);
  }

  const promoCodes = [];
  for (const code of codeSet) {
    const qr = await QRCode.toDataURL(`${code}`);

    promoCodes.push({
      code,
      qrImage: qr,
      evoucherId,
      hasUsed: false,
    });
  }

  return promoCodes;
}

process.on('message', msg => {
  const {
    status,
    data: { evoucherId, qty },
  } = msg;
  if (status === 'start' && qty > 0) {
    generate(evoucherId, qty)
      .then(codes => {
        process.send({
          status: 'done',
          data: {
            codes,
          },
        });
      })
      .catch(console.error);
  }
});
