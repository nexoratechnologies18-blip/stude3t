# دليل الربط بخادم حقيقي للإرسال التلقائي الكامل
# Real Backend Integration Guide — Fully Automatic Sending

النظام الآن (بعد التحديث) يرسل **رسائل حقيقية فعلية** لولي الأمر عبر رابط
واتساب الرسمي "Click to Chat" (`wa.me`) أو رابط `sms:` القياسي — بدون أي
حساب أو مفتاح API. الفرق الوحيد عن الإرسال التلقائي بالكامل هو أن الموظف
يحتاج للضغط على زر "إرسال" داخل واتساب/الرسائل بعد أن يفتح النظام المحادثة
جاهزة بالرسالة الصحيحة. هذا **إرسال حقيقي فعلي**، وليس محاكاة.

The system now sends **real, actual messages** to guardians via WhatsApp's
official "Click to Chat" link (`wa.me`) or the standard `sms:` link — with
no account or API key needed. The only difference from *fully automatic*
sending is that staff must tap "Send" inside WhatsApp/Messages after the
system opens the conversation pre-filled with the correct message. This is
**real sending**, not a simulation.

إذا أردت أن تُرسَل الرسالة تلقائياً بالكامل بدون أي تدخل بشري (مثلاً عند
حفظ الحضور مباشرة)، فهذا يتطلب حتماً **خادماً (Backend)** يحتفظ بمفاتيح
API سرّية، لأن أي مفتاح API حقيقي (Twilio, Meta WhatsApp Cloud API...)
**لا يجوز أبداً** وضعه داخل كود JavaScript يعمل في متصفح المستخدم — أي
شخص يفتح "عرض مصدر الصفحة" سيراه ويمكنه استخدامه لإرسال رسائل مزيّفة على
حسابك وتحميلك تكاليف. هذا قيد أمني حقيقي، وليس مجرد اختيار تصميمي.

If you want messages sent **fully automatically with zero human action**
(e.g. the instant attendance is saved), that requires a **backend server**
that holds secret API keys, because a real API key (Twilio, Meta WhatsApp
Cloud API...) must **never** be embedded in browser-side JavaScript — anyone
who views the page source could steal it and send messages on your account
at your expense. This is a genuine security constraint, not a design choice.

---

## الخيارات المتاحة | Available providers

| المزوّد / Provider | النوع / Type | ملاحظات / Notes |
|---|---|---|
| **Meta WhatsApp Cloud API** | رسمي من واتساب مباشرة / Official, direct from Meta | مجاني ضمن حدود معينة شهرياً؛ يحتاج تفعيل رقم عمل / Free within a monthly allowance; requires a verified business number |
| **Twilio (WhatsApp Business API / SMS)** | وسيط (Business Solution Provider) / Third-party BSP | إعداد أسرع وتسعير واضح بالدقيقة/الرسالة / Faster setup, clear per-message pricing |
| **مزوّدو SMS محليون في عُمان** (مثل عُمانتل، أو بوابات SMS التجارية) / Local Omani SMS gateways (Omantel, or commercial SMS gateway providers) | SMS فقط / SMS only | خيار جيد إذا كانت الرسائل النصية القصيرة كافية بدل واتساب / Good if plain SMS is enough instead of WhatsApp |

---

## الخطوات العامة | General steps

1. **أنشئ حساباً** لدى أحد المزوّدين أعلاه واحصل على مفاتيح API (Account SID + Auth Token لـ Twilio، أو Access Token + Phone Number ID لـ WhatsApp Cloud API).
   **Create an account** with one of the providers above and obtain API credentials.

2. **انشر خادماً صغيراً** يحتفظ بهذه المفاتيح بأمان (متغيرات بيئة/Environment Variables، وليس داخل الكود). أفضل الخيارات لمشروع بهذا الحجم:
   **Deploy a small server** that holds these keys safely (environment variables, never hard-coded). Good options for a project this size:
   - Cloudflare Workers (مجاني للاستخدام المحدود / free tier available)
   - Vercel / Netlify Functions
   - أي استضافة Node.js بسيطة / any simple Node.js hosting

3. استخدم النموذج التالي كنقطة بداية (Node.js + Express، مع مثال Twilio):
   Use the snippet below as a starting point (Node.js + Express, Twilio example):

```javascript
// server.js — مثال بسيط لا يُشغَّل داخل هذا المشروع، بل على خادمك الخاص
// Example only — deploy this on your own server, not inside this static project
const express = require('express');
const twilio = require('twilio'); // npm install twilio

const app = express();
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/api/send-notification', async (req, res) => {
  try {
    const { phone, message, channel } = req.body; // phone بصيغة دولية كاملة مثل 96891234567
    const to = channel === 'sms' ? `+${phone}` : `whatsapp:+${phone}`;
    const from = channel === 'sms' ? process.env.TWILIO_SMS_NUMBER : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

    const result = await client.messages.create({ to, from, body: message });
    res.json({ ok: true, sid: result.sid });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(process.env.PORT || 3000);
```

4. بعد نشر الخادم، عدّل الرابط `BACKEND_ENDPOINT` داخل الدالة `sendViaBackendAPI`
   الموجودة في نهاية ملف `js/notify.js` ليشير لرابط خادمك الفعلي.
   After deploying, update the `BACKEND_ENDPOINT` constant inside the
   `sendViaBackendAPI` function at the bottom of `js/notify.js` to point to
   your real server URL.

5. استبدل استدعاء `sendGuardianNotification(...)` بـ `await sendViaBackendAPI(...)`
   في الأماكن التي تريد فيها إرسالاً تلقائياً صامتاً بدل فتح واتساب/الرسائل،
   أو أضف زراً إضافياً "إرسال تلقائي" يستدعي الدالة الجديدة.
   Replace calls to `sendGuardianNotification(...)` with
   `await sendViaBackendAPI(...)` wherever you want silent automatic sending
   instead of opening WhatsApp/Messages, or add a separate "Send
   automatically" button that calls the new function.

---

## خيار وسيط بدون كتابة كود خادم | No-code alternative

خدمات مثل **Zapier** أو **Make (Integromat)** تتيح إنشاء "Webhook" يستقبل
طلباً من هذا النظام (عبر `fetch`) ثم يرسله فعلياً عبر واتساب/SMS دون كتابة
أي كود خادم بنفسك — مناسب لمدرسة لا تملك مطوّراً دائماً.

Services like **Zapier** or **Make (Integromat)** let you create a webhook
that receives a request from this system (via `fetch`) and sends it through
WhatsApp/SMS for you — no server code required. This suits a school without
a dedicated developer.

---

## ملاحظة: نفس آلية Webhook تُستخدم لربط "بوابة تعليمية" أو نظام SIS
## Note: the same webhook mechanism also powers the "school portal / SIS" link

حقل "التكامل الخارجي" في لوحة الإدارة (رابط + مفتاح API) يرسل تلقائياً بيانات
كل غياب/تأخير بصيغة JSON لأي رابط تضعه فيه — تماماً بنفس مبدأ Zapier أعلاه.
إن حصلت مدرستكم مستقبلاً على تكامل رسمي حقيقي مع نظام إدارة مدرسي (سواء من
وزارة التربية والتعليم أو أي مزوّد آخر)، فكل ما تحتاجونه هو رابط الاستقبال
الذي يوفّرونه — لا حاجة لتعديل أي كود.

The "External Integration" field in the Admin panel (URL + API key)
automatically POSTs every absence/lateness record as JSON to whatever URL
you put there — the same principle as the Zapier example above. If your
school later obtains a real, official integration with a student information
system (whether from the Ministry of Education or another provider), all
you need is the receiving URL they give you — no code changes required.
