# تحويل النظام لتطبيق أندرويد ونشره على Google Play
# Turning This Into an Android App & Publishing on Google Play

## ⚠️ اقرأ هذا أولاً | Read this first

**ما لا أقدر أفعله:** لا أقدر إنشاء حساب مطوّر Google Play، دفع الرسوم، التحقق
من الهوية، أو نشر التطبيق نيابةً عنكم — هذه خطوات تتطلّب حساب Google حقيقي
وهوية ومبلغاً مالياً يخصّكم أنتم فقط. كما لا أقدر تصميم أيقونات/صور حقيقية،
فاستخدمت أيقونة مبسّطة أعددتها برمجياً يمكن استبدالها لاحقاً بسهولة.

**What I cannot do:** I cannot create a Google Play developer account, pay
its fee, verify an identity, or submit/publish the app — these steps
require a real Google account, identity, and payment that belong to you.

**ما فعلته فعلياً واختبرته:** حوّلت الموقع لتطبيق ويب مثبَّت (PWA) يعمل بلا
إنترنت بعد أول تشغيل، وجهّزت مشروع Capacitor الذي يحوّله لتطبيق أندرويد
أصلي، واختبرت الأوامر التالية فعلياً على خادم حقيقي وتأكدت أنها تعمل:
`npm install`، `npx cap add android` (يبني مشروع أندرويد كامل بنجاح). التوقف
الوحيد كان عند خطوة **بناء وتوقيع ملف APK/AAB نفسها**، لأنها تحتاج تحميل
Android SDK / Gradle من خوادم Google، وشبكة هذه البيئة لا تسمح بالوصول لتلك
الخوادم تحديداً — لذا هذه الخطوة الأخيرة يجب أن تتم على جهازكم عبر Android
Studio (موضّح بالتفصيل أدناه).

**What I actually did and verified:** converted the site into an installable
PWA that works offline after first load, and set up a Capacitor project that
wraps it as a native Android app — I actually ran `npm install` and
`npx cap add android` on a real machine and confirmed they succeed. The one
step that is out of reach here is **actually compiling and signing the
APK/AAB**, since that needs to download the Android SDK/Gradle from Google's
servers, and this environment's network doesn't reach those specific
servers. That final step has to happen on your own machine via Android
Studio (full steps below).

---

## ✅ الخطوة صفر (جاهزة بالفعل): تطبيق ويب قابل للتثبيت (PWA)

بعد فتح النظام مرة واحدة (عبر خادم محلي، راجع README)، يستطيع أي مستخدم على
أندرويد الضغط على "إضافة إلى الشاشة الرئيسية" من قائمة المتصفح، فيظهر
النظام كتطبيق مستقل بأيقونته الخاصة، ويعمل حتى بلا إنترنت بعد ذلك. هذا لا
يحتاج Google Play إطلاقاً وجاهز الآن فوراً.

## Step Zero (already done): an installable PWA

Once the system is opened once (via a local/live server — see README), any
Android user can tap "Add to Home Screen" from the browser menu and it opens
as a standalone app with its own icon, working offline afterward. This
needs no Google Play at all and is ready right now.

---

## 🅰️ المسار الموصى به: تطبيق أندرويد أصلي عبر Capacitor

مجلد `android-app/` داخل هذا المشروع جاهز. نفّذوا هذه الأوامر على جهازكم
(تحتاجون [Node.js](https://nodejs.org) و[Android Studio](https://developer.android.com/studio) مثبَّتين):

## 🅰️ Recommended path: native Android app via Capacitor

The `android-app/` folder inside this project is ready. Run these on your
own machine (you'll need [Node.js](https://nodejs.org) and
[Android Studio](https://developer.android.com/studio) installed):

```bash
cd attendance-system/android-app

# انسخوا ملفات الموقع الفعلية داخل مجلد www (خطوة تُعاد فقط عند تحديث الموقع)
mkdir -p www
cp -r ../*.html ../css ../js ../icons ../manifest.json ../sw.js ../favicon.ico www/

# ثبّتوا التبعيات وابنوا مشروع أندرويد (نفس الأوامر التي اختبرتُها بنجاح)
npm install
npx cap add android
npx cap sync android

# افتحوا المشروع في Android Studio لإكمال البناء والتوقيع
npx cap open android
```

داخل Android Studio: **Build → Generate Signed App Bundle / APK**، اختاروا
**Android App Bundle (AAB)** — الصيغة التي يطلبها Google Play حالياً — ثم
أنشئوا مفتاح توقيع (Keystore) جديداً.

Inside Android Studio: **Build → Generate Signed App Bundle / APK**, choose
**Android App Bundle (AAB)** — the format Google Play currently requires —
then create a new signing key (Keystore).

> 🔑 **مهم جداً:** احفظوا ملف الـ Keystore وكلمة مروره في مكان آمن (وليس معي
> أو مع أي طرف ثالث). فقدانه يعني عدم القدرة على نشر أي تحديث مستقبلي لنفس
> التطبيق أبداً — Google لا يمكنه استرجاعه بأي شكل.
>
> 🔑 **Critical:** store the Keystore file and its password somewhere safe
> (never with me or any third party). Losing it means you can never publish
> an update to this same app again — Google cannot recover it under any
> circumstances.

كل مرة تعدّلون فيها الموقع مستقبلاً، أعيدوا خطوة النسخ (`cp -r`) ثم
`npx cap sync android` قبل إعادة البناء.

Whenever you edit the website later, repeat the copy step (`cp -r`) then
`npx cap sync android` before rebuilding.

---

## 🅱️ مسار بديل أسهل تقنياً: PWABuilder (بدون Android Studio)

إن استضفتم النظام على رابط حقيقي (GitHub Pages، Netlify، Firebase Hosting —
كلها مجانية) بدل تشغيله محلياً فقط، يمكنكم فتح
[pwabuilder.com](https://www.pwabuilder.com)، إدخال الرابط، والضغط على "بناء
حزمة أندرويد" — يولّد لكم ملف AAB جاهزاً للرفع مباشرة دون تثبيت أي أدوات.

## 🅱️ Easier alternative: PWABuilder (no Android Studio needed)

If you host the system on a real URL (GitHub Pages, Netlify, Firebase
Hosting — all free) instead of only running it locally, you can open
[pwabuilder.com](https://www.pwabuilder.com), enter that URL, and click
"Package for Android" — it generates a ready-to-upload AAB file with zero
local tooling.

---

## 📋 متطلبات النشر الفعلي على Google Play | What Play Store publishing actually requires

هذه الخطوات يجب أن يقوم بها شخص حقيقي من المدرسة عبر حسابه الخاص:

These must be done by a real person at the school, through their own account:

1. **نوع الحساب:** حساب "منظمة/جهة رسمية" (Organization) أفضل لمدرسة من
   حساب شخصي — يحتاج رقم D-U-N-S (مجاني من Dun & Bradstreet) لكنه **يُعفيكم
   من متطلب الاختبار المغلق الإلزامي** (12 مختبِراً لمدة 14 يوماً متواصلة)
   المفروض حالياً (٢٠٢٦) على الحسابات الشخصية الجديدة قبل النشر العلني.
   **Account type:** an "Organization" account suits a school better than a
   personal one — it needs a free D-U-N-S number (Dun & Bradstreet), but it
   **exempts you from the mandatory closed-testing requirement** (12 testers
   opted in for 14 continuous days) currently (2026) imposed on new personal
   accounts before public release.
2. **رسوم التسجيل:** 25 دولاراً أمريكياً، مرة واحدة فقط، عبر
   [Google Play Console](https://play.google.com/console/signup).
   **Registration fee:** a one-time US$25 via
   [Google Play Console](https://play.google.com/console/signup).
3. **التحقق من الهوية:** وثيقة هوية رسمية (وربما صورة شخصية)، وتفعيل
   التحقق بخطوتين على حساب Google المستخدَم.
   **Identity verification:** an official ID document (and possibly a
   selfie), plus 2-Step Verification enabled on the Google account used.
4. **سياسة الخصوصية (إلزامية وحسّاسة هنا):** بما أن النظام يخزّن بيانات
   طلاب حقيقيين (أسماء، أرقام هواتف أولياء الأمور)، تتطلب استمارة "أمان
   البيانات" في Play Console رابطاً فعلياً لسياسة خصوصية منشورة، توضّح ما
   يُجمَع وكيف يُخزَّن (محلياً على الجهاز فقط حالياً). بما أن البيانات تخص
   قاصرين، يُستحسن مراجعة إدارة المدرسة/الجهة القانونية المختصة لصياغتها،
   لا مجرد نص عام. يسعدني صياغة مسودة إن رغبتم.
   **Privacy policy (mandatory, and sensitive here):** since the system
   stores real student data (names, guardian phone numbers), Play Console's
   "Data Safety" form requires a link to a published privacy policy
   describing what's collected and how it's stored (currently: locally on
   the device only). Because this concerns minors' data, it's best reviewed
   by the school's administration/legal contact rather than a generic
   template. I'm happy to draft a starting version if you'd like.
5. **استمارة تصنيف المحتوى** (Content Rating Questionnaire) داخل Play
   Console — بسيطة لتطبيق كهذا، عادة تُصنَّف "للجميع".
   **Content Rating Questionnaire** inside Play Console — simple for an app
   like this, typically rated "Everyone".
6. **لقطات شاشة ووصف** للصفحة العامة للتطبيق على المتجر.
   **Screenshots and a description** for the app's public store listing.

---

## ملخص سريع | Quick summary

| الخطوة / Step | من ينفّذها / Who does it | الحالة / Status |
|---|---|---|
| PWA قابل للتثبيت / Installable PWA | ✅ جاهز الآن / Ready now | تم |
| مشروع Capacitor / Capacitor project | ✅ جاهز الآن / Ready now | تم |
| بناء وتوقيع AAB / Build & sign AAB | أنتم عبر Android Studio / You, via Android Studio | يتطلب جهازكم |
| حساب Google Play + الدفع / Google Play account + payment | أنتم فقط / You only | لا يمكنني فعله |
| سياسة الخصوصية / Privacy policy | أنتم (وبإمكاني صياغة مسودة) / You (draft help available) | لم يبدأ |
| النشر الفعلي / Actual submission | أنتم فقط / You only | لا يمكنني فعله |
