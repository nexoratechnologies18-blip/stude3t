# نظام الحضور والانصراف — مدرسة بلعرب بن سلطان
# Bal'arab bin Sultan School — Attendance System

نظام حضور وانصراف إلكتروني للطلاب، مبني بالكامل بـ HTML5 / CSS3 / JavaScript (Vanilla)
بدون أي إطار عمل (Framework)، مع قاعدة بيانات محلية عبر LocalStorage.

A fully client-side student attendance system built with plain HTML5 / CSS3 /
Vanilla JavaScript (no frameworks), using LocalStorage as a local database.

---

## 🚀 التشغيل | Running the project

**الطريقة الأبسط | Simplest way:** افتح ملف `index.html` مباشرة في المتصفح.
Just open `index.html` directly in your browser.

**موصى به لتفعيل كاميرا QR بالكامل | Recommended for full QR camera support:**
معظم المتصفحات تمنع الوصول للكاميرا (`getUserMedia`) على ملفات مفتوحة مباشرة (`file://`).
شغّل خادماً محلياً بسيطاً من داخل مجلد المشروع، مثل:

Most browsers block camera access (`getUserMedia`) when a page is opened directly
from disk (`file://`). Serve the folder with any simple local server, e.g.:

```bash
python3 -m http.server 8080
# then open http://localhost:8080 in your browser
```

خيار الإدخال اليدوي لرقم الطالب في صفحة QR يعمل دائماً بدون كاميرا.
The manual student-ID entry option on the QR page always works without a camera.

---

## 🔔 الإشعارات التلقائية وربط الأنظمة الخارجية | Automatic Notifications & External Integration

**قائمة الإشعارات المعلّقة (تلقائية):** عند حفظ حضور فيه غياب أو تأخير، يضيف
النظام الطالب تلقائياً لقائمة "الإشعارات المعلّقة" — تظهر كبانر في لوحة
التحكم وكقسم مخصص في صفحة الإشعارات، بدل الحاجة للبحث اليدوي عن كل طالب.
تبقى ضغطة "إرسال" الأخيرة داخل واتساب/الرسائل يدوية (قيد أمان من المتصفح
نفسه، وليس قيداً في هذا النظام).

**Auto-queued pending notifications:** whenever attendance is saved with an
absence or lateness, the student is automatically added to a "Pending
Notifications" list — shown as a dashboard banner and in a dedicated section
on the Notifications page — instead of manually searching for each student.
The final "Send" tap inside WhatsApp/Messages remains manual (a browser
security constraint, not a limitation of this system).

**ربط نظام خارجي (بوابة تعليمية / SIS):** في لوحة الإدارة ← تبويب "التكامل
الخارجي"، يمكن إدخال رابط Webhook حقيقي (إن توفّر لديكم) ليُرسَل إليه تلقائياً
كل سجل غياب/تأخير كـ JSON. **هذا الحقل معطَّل افتراضياً ولا يتصل بأي جهة** —
البوابة التعليمية الرسمية لوزارة التربية والتعليم العُمانية (eportal.moe.gov.om)
نظام حكومي مغلق بلا API عام، فلا يمكن لأي نظام خارجي الاتصال بها مباشرة.
استخدموا هذا الحقل فقط إن حصلتم على نقطة تكامل حقيقية (من الوزارة، أو نظام
SIS آخر تستخدمه المدرسة، أو وسيط مثل Zapier/Make) — راجعوا
`WHATSAPP-SMS-BACKEND-GUIDE.md` لتفاصيل بناء طرف الاستقبال. كل محاولة إرسال
(نجحت أو فشلت أو تخطّاها النظام لعدم التفعيل) تُسجَّل بشفافية في "سجل محاولات
المزامنة" بنفس التبويب.

**External system integration (school portal / SIS):** In the Admin panel →
"External Integration" tab, you can enter a real webhook URL (if you have
one) so every absence/lateness record is automatically POSTed to it as JSON.
**This is disabled by default and connects to nothing out of the box** —
Oman's official Ministry of Education portal (eportal.moe.gov.om) is a closed
government system with no public API, so no outside system can push data to
it directly. Only use this field once you obtain a real integration endpoint
(from the Ministry, a different school SIS, or a middleman like Zapier/Make)
— see `WHATSAPP-SMS-BACKEND-GUIDE.md` for how to build the receiving end.
Every attempt (success, failure, or skipped-because-disabled) is logged
transparently in the "Sync Attempts Log" on the same tab.

---

## 📚 حضور الحصص (٨ حصص) والتأخير الصباحي | Period Attendance (8 Periods) & Morning Lateness

**حضور الحصص:** بالإضافة للحضور الصباحي العام، يدعم النظام تسجيل حضور/غياب
الطالب **لكل حصة على حدة** (٨ حصص افتراضياً، قابلة للتعديل من "الصفوف
والشعب" ← "إدارة الحصص الدراسية"). صفحة "حضور الحصص" الجديدة تتيح اختيار
الصف/الشعبة/الحصة/التاريخ ثم تسجيل حالة كل طالب. هذه طبقة **مستقلة تماماً**
عن الحضور الصباحي: غياب طالب عن حصة واحدة لا يُسجَّل كغياب لليوم كامل، ولا
يُضاف تلقائياً لقائمة "الإشعارات المعلّقة" أو لنقطة الربط الخارجي (لتفادي
إشعار ولي الأمر بغياب "يوم كامل" بينما الطالب غاب عن حصة واحدة فقط) — الإشعار
هنا اختياري ويدوي دائماً.

**Period attendance:** in addition to the general morning attendance, the
system supports recording each student's presence/absence **per individual
class period** (8 periods by default, editable from "Grades & Sections" →
"Manage Class Periods"). The new "Period Attendance" page lets you pick a
grade/section/period/date and record each student's status there. This is a
**fully separate layer** from morning attendance: a single-period absence is
never recorded as a full-day absence, and is never auto-added to the Pending
Notifications queue or the external-integration sync (to avoid notifying a
guardian about a "full day" absence when it was really just one class) —
notifying the guardian here is always optional and manual.

**التأخير الصباحي:** صفحة "التأخير" الحالية (إعدادات وقت بداية الدوام،
تصنيف بسيط/متوسط/متكرر، قائمة الأكثر تأخيراً) تبقى مخصصة **فقط** لتأخر
الطالب عن الوصول للمدرسة صباحاً — وهي مستقلة تماماً عن حالة "متأخر" التي قد
تُسجَّل لحصة معيّنة في صفحة "حضور الحصص".

**Morning lateness:** the existing "Lateness" page (school start-time
setting, minor/moderate/repeated classification, top-late-students list)
remains dedicated **only** to a student being late arriving at school in the
morning — entirely separate from a "late" status that might be recorded for
a specific period on the "Period Attendance" page.

---

## 👥 مشرفو الغياب واستثناءات الطلاب | Attendance Supervisors & Student Exceptions

**مشرف الغياب (دور جديد):** بجانب المدير والمعلم، يمكن للمدير الآن إنشاء
حسابات "مشرف غياب" من لوحة الإدارة ← تبويب "مشرفو الغياب". المشرف يرى كل
الصفوف والشعب (بلا تقييد، خلافاً للمعلم)، لكن المدير يختار له من قائمة محددة
أي الصفحات التشغيلية يُسمح له باستخدامها: تسجيل الحضور، حضور الحصص، QR،
الانصراف، التأخير، الإشعارات، التقارير، التحليلات. لا يملك المشرف وصولاً
لإدارة الطلاب/المعلمين/الصفوف أو لوحة الإدارة نفسها مهما كانت صلاحياته.
حساب تجريبي: `m.alkindi` / `super123`.

**Attendance Supervisor (new role):** alongside Admin and Teacher, the admin
can now create "Attendance Supervisor" accounts from the Admin panel →
"Attendance Supervisors" tab. A supervisor sees every grade & section
(unrestricted, unlike a teacher), but the admin chooses exactly which
operational pages they may use from a fixed list: Attendance, Period
Attendance, QR, Checkout, Lateness, Notifications, Reports, Analytics. A
supervisor never gets access to managing students/teachers/grades or the
Admin panel itself, regardless of granted permissions. Demo account:
`m.alkindi` / `super123`.

**استثناء الطلاب:** من نافذة تعديل أي طالب (صفحة "الطلاب")، يمكن تفعيل
استثناء له مع سبب ونطاق:
- **حصص محددة:** الطالب لا يُتوقَّع حضوره لحصص بعينها (مثال: إعفاء طبي من
  الرياضة) — تُعطَّل تلك الحصص له تحديداً في صفحة "حضور الحصص" فقط، مع بقاء
  حضوره الصباحي وباقي الحصص طبيعياً. اتركها فارغة لتشمل كل الحصص.
- **استثناء من التنبيهات والتحليلات:** غياب/تأخير الطالب يُسجَّل كالمعتاد،
  لكن لا يُضاف تلقائياً لقائمة "الإشعارات المعلّقة"، ولا يُرسَل لنظام خارجي
  عبر التكامل، ولا يظهر ضمن قوائم "الغياب/التأخير المتكرر" بالتحليلات.
- **فترة زمنية اختيارية** (من/إلى) — اتركها فارغة لاستثناء دائم حتى إشعار آخر.
تظهر شارة "مستثنى ⚑" بجانب اسم الطالب في كل مكان يظهر فيه أثناء سريان الاستثناء.

**Student exceptions:** from any student's edit window (Students page), you
can enable an exception with a reason and scope:
- **Specific periods:** the student isn't expected at particular periods
  (e.g., a medical PE exemption) — those periods are disabled for them only
  on the "Period Attendance" page, while morning attendance and other
  periods stay normal. Leave empty to cover all periods.
- **Exempt from notifications & analytics:** absences/lateness are still
  recorded normally, but are never auto-added to the Pending Notifications
  queue, never sent to an external system via the integration webhook, and
  never appear in the "chronic absence/lateness" analytics lists.
- **Optional date range** (from/to) — leave empty for a standing exception
  until removed.
An "Exempt ⚑" badge appears next to the student's name everywhere while the
exception is active.

---

## 🔑 حسابات تجريبية | Demo accounts

| الدور / Role | اسم المستخدم / Username | كلمة المرور / Password |
|---|---|---|
| مدير / Admin | `admin` | `admin123` |
| معلم / Teacher | `t.alharthy` | `teach123` |
| معلم / Teacher | `f.albalushi` | `teach123` |
| معلم / Teacher | `k.alrawahi` | `teach123` |
| مشرف غياب / Supervisor | `m.alkindi` | `super123` |

يتم إنشاء بيانات تجريبية (طلاب، صفوف، شعب، سجلات حضور) تلقائياً عند أول تشغيل.
Demo data (students, grades, sections, attendance history) is seeded automatically on first run.

> ⚠️ **أرقام أولياء الأمور في البيانات التجريبية أرقام وهمية وليست حقيقية.**
> لتجربة زر "إرسال إشعار لولي الأمر" فعلياً، عدّل بيانات أي طالب من صفحة
> "الطلاب" وضع رقم هاتف واتساب حقيقي في حقل "رقم هاتف ولي الأمر" أولاً.
>
> ⚠️ **The guardian phone numbers in the demo data are fake, not real.**
> To actually try the "Notify Guardian" button, first edit a student from
> the Students page and put a real WhatsApp number in the guardian-phone field.

---

## 📁 هيكل المشروع | Project structure

```
attendance-system/
├── index.html            صفحة تسجيل الدخول / Login
├── dashboard.html         لوحة التحكم / Dashboard
├── students.html          إدارة الطلاب / Students management
├── classes.html           الصفوف والشعب (مدير فقط) / Grades & sections (admin only)
├── attendance.html        تسجيل الحضور / Record attendance
├── period-attendance.html تسجيل حضور الحصص (٨ حصص) / Period attendance (8 periods)
├── qr.html                توليد/مسح رمز QR / QR generate & scan
├── checkout.html          تسجيل الانصراف / Checkout
├── late.html              إعدادات وتتبع التأخير (الصباحي) / Lateness settings & tracking (morning)
├── notifications.html     سجل إشعارات أولياء الأمور / Guardian notifications log
├── reports.html           التقارير / Reports
├── analytics.html         التحليلات / Analytics
├── admin.html             لوحة الإدارة: إعدادات/معلمون/مشرفون/تكامل/سجل/نسخ احتياطي (مدير فقط) / Admin panel: settings/teachers/supervisors/integration/audit/backup (admin only)
├── 404.html
├── manifest.json          بيانات تطبيق PWA / PWA manifest
├── sw.js                  Service Worker (عمل بلا إنترنت) / offline support
├── favicon.ico
├── icons/                 أيقونات PWA/أندرويد المولَّدة / Generated PWA/Android icons
├── android-app/           غلاف Capacitor لتطبيق أندرويد (راجع ANDROID-APP-GUIDE.md) / Capacitor Android wrapper (see ANDROID-APP-GUIDE.md)
├── css/style.css          نظام تصميم موحّد (Light/Dark, RTL/LTR) / Shared design system
└── js/
    ├── db.js              طبقة البيانات (LocalStorage) / Data layer
    ├── auth.js            الجلسة والصلاحيات (مدير/معلم/مشرف) / Session & permissions (admin/teacher/supervisor)
    ├── i18n.js             الترجمة عربي/إنجليزي / AR/EN translations
    ├── layout.js           الشريط الجانبي والعلوي المشترك / Shared sidebar & topbar
    ├── ui.js               Toast / Modal / Confirm / Tabs
    ├── utils.js            دوال مساعدة عامة / General helpers
    ├── exceptions.js       منطق استثناءات الطلاب / Student-exception logic
    ├── profile.js          الملف الشخصي للطالب / Student profile modal
    ├── notify.js           إرسال إشعار حقيقي عبر واتساب/SMS + قائمة الإشعارات المعلّقة / Real WhatsApp/SMS notifications + pending queue
    ├── portal-sync.js      نقطة ربط عامة بنظام خارجي (webhook) / Generic external-system (webhook) integration point
    ├── period-attendance.js منطق تسجيل حضور الحصص / Period-attendance logic
    └── *.js                منطق كل صفحة على حدة / Per-page logic
```

---

## ⚠️ ملاحظات أمنية مهمة | Important security notes

هذه نسخة تجريبية (Front-End فقط). عند التحويل لنظام إنتاجي حقيقي، يجب:
This is a **Front-End-only demo**. Before going to production you must:

1. نقل تسجيل الدخول والتحقق من الصلاحيات إلى خادم حقيقي (Server-Side)، وعدم الاعتماد على JavaScript في المتصفح لأي تحقق أمني.
   Move authentication & authorization to a real backend — never trust client-side JS for security checks.
2. استبدال كلمات المرور النصية بتشفير (hash + salt) على الخادم.
   Replace plaintext demo passwords with proper hashing (bcrypt/argon2) server-side.
3. استبدال LocalStorage بقاعدة بيانات حقيقية (MySQL, PostgreSQL, Firebase/Firestore...) عبر واجهة API.
   Replace LocalStorage with a real database (MySQL, PostgreSQL, Firebase...) behind an API.
4. زر "إرسال إشعار لولي الأمر" يرسل **رسالة حقيقية فعلية** الآن عبر رابط واتساب "Click to Chat" أو `sms:`، لا يحتاج حساباً أو مفتاح API — لكنه يحتاج ضغطة "إرسال" أخيرة من الموظف داخل واتساب/الرسائل. للإرسال التلقائي الكامل بدون أي تدخل بشري، راجع `WHATSAPP-SMS-BACKEND-GUIDE.md` المرفق.
   The "Notify Guardian" button now sends a **real, actual message** via a WhatsApp "Click to Chat" link or `sms:` link — no account or API key needed — but it needs one final "Send" tap from staff inside WhatsApp/Messages. For fully automatic sending with zero human action, see the included `WHATSAPP-SMS-BACKEND-GUIDE.md`.
5. استبدال "تصدير PDF" (المعتمد حالياً على طباعة المتصفح) بمكتبة PDF من جهة الخادم إن رغبت بملفات PDF حقيقية مباشرة.
   Replace the browser-print-based "Export PDF" with a server-side PDF library if a direct binary file is required.
6. حقل "ربط نظام خارجي" في لوحة الإدارة **معطَّل ولا يتصل بأي جهة افتراضياً**. لا تفعّلوه إلا برابط حقيقي حصلتم عليه رسمياً — راجعوا قسم "الإشعارات التلقائية وربط الأنظمة الخارجية" أعلاه.
   The "External Integration" field in the Admin panel is **disabled and connects to nothing by default**. Only enable it with a real endpoint you've officially obtained — see the "Automatic Notifications & External Integration" section above.

جميع نقاط الربط هذه موثّقة أيضاً بتعليقات داخل الكود المصدري.
All of these integration points are also documented with comments in the source code.

---

## 🎨 المكتبات الخارجية المستخدمة | External libraries used (via CDN, loaded by the browser)

- [Chart.js](https://www.chartjs.org/) — الرسوم البيانية / charts
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/) — توليد رموز QR / QR generation
- [jsQR](https://github.com/cozmo/jsQR) — قراءة رموز QR من الكاميرا / QR scanning from camera
- [Google Fonts – Tajawal](https://fonts.google.com/specimen/Tajawal) — الخط العربي / Arabic typeface

لا توجد أي مكتبات JavaScript ثقيلة (React/Vue/Angular) — الكود بالكامل Vanilla JS.
No heavy JS frameworks — the entire app is Vanilla JS as requested.

---

## 📱 تطبيق جوّال ونشره على Google Play | Mobile App & Google Play Publishing

النظام الآن **تطبيق ويب قابل للتثبيت (PWA)** — افتحوه مرة عبر خادم محلي أو
رابط حقيقي (راجع "التشغيل" أعلاه)، ثم اضغطوا "إضافة إلى الشاشة الرئيسية" من
متصفح أندرويد ليعمل كتطبيق مستقل بأيقونته الخاصة، حتى بلا إنترنت لاحقاً.

The system is now an **installable PWA** — open it once via a local server
or a real URL (see "Running the project" above), then tap "Add to Home
Screen" from an Android browser to run it as a standalone app with its own
icon, working offline afterward.

لتحويله لتطبيق أندرويد أصلي (`.aab`) ونشره فعلياً على Google Play، راجعوا
الدليل المخصص **`ANDROID-APP-GUIDE.md`** في جذر المشروع — يشرح بصدق ما
جهّزته واختبرته فعلاً (مشروع Capacitor في مجلد `android-app/`)، مقابل ما
يتطلّب جهازكم وحسابكم الخاص لدى Google (البناء النهائي والتوقيع والنشر).

To turn it into a native Android app (`.aab`) and actually publish it on
Google Play, see the dedicated **`ANDROID-APP-GUIDE.md`** at the project
root — it honestly explains what's already prepared and verified (a
Capacitor project in `android-app/`) versus what requires your own machine
and your own Google account (final build, signing, and submission).
