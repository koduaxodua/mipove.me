# შენი დავალებები — ნაბიჯ-ნაბიჯ

ეს ფაილი შენთვისაა. კოდი უკვე მზადაა, მაგრამ რამდენიმე რამ მხოლოდ შენი ექაუნთებიდან კეთდება.
თითო დავალება 5-10 წუთია. თანმიმდევრობით მიჰყევი.

> ყველაფერი დაბრუნებადია. GitHub-ზე დევს `v1` ტეგი.
> Vercel-ზე: Deployments → წინა დეპლოი → **Instant Rollback**.

---

## 0. Vercel-ზე ორი პროექტი — რა გააკეთო

მე ახალი პროექტი **არ შემიქმნია**. როცა GitHub რეპოს სახელი `pawswipegeo`-დან `mipove.me`-ზე გადაარქვი, Vercel-მა ახალი ცარიელი პროექტი შექმნა იმავე რეპოზე.

- **`pawswipegeo`** (ქვემოთ წერია `mipove.me`) = **სწორი**. აქ არის დომენი და env ცვლადები. **დატოვე.**
- **`mipove.me`** ("No Production Deployment") = **ცარიელი დუბლიკატი**. **წაშალე.**

როგორ წავშალო ცარიელი:
1. vercel.com → გახსენი პროექტი **`mipove.me`** (სადაც წერია "No Production Deployment")
2. Settings → ბოლოში → **Delete Project**
3. შეამოწმე რომ **`pawswipegeo`** რჩება და დომენი `mipove.me` მასზეა მიბმული


სურვილისამებრ: `pawswipegeo` → Settings → General → Project Name → გადაარქვი `mipove.me`-ად. დომენი არ გაფუჭდება.

---

## 1. Deploy სწორი პროექტიდან

1. გახსენი **`pawswipegeo`**
2. Settings → Git → უნდა ეწეროს `koduaxodua/mipove.me`
3. ამის შემდეგ PR merge ავტომატურად განაახლებს საიტს

---

## 2. Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://mipove.me`
3. Verify (Google Analytics მეთოდით, თუ ჩანს)
4. Sitemaps → `sitemap.xml` → Submit

---

## 3. Telegram ავტო-პოსტი (უფასო Bot API)

კოდი უკვეა (`api/notify-telegram.ts`). სანამ ცვლადებს არ დაამატებ, გამორთულია.

1. Telegram → `@BotFather` → `/newbot` → მიიღე ტოკენი
2. შექმენი Public არხი (მაგ. `t.me/mipoveme`) → ბოტი დაამატე Admin-ად
3. Vercel → **`pawswipegeo`** → Settings → Environment Variables (Production):
   - `TELEGRAM_BOT_TOKEN` = ტოკენი
   - `TELEGRAM_CHANNEL_ID` = `@mipoveme`
4. Deployments → Redeploy
5. დაამატე საცდელი ცხოველი → არხში პოსტი უნდა გამოჩნდეს

ტოკენის გარეშეც მუშაობს: ცხოველის გვერდზე ღილაკი „გაზიარება Telegram-ზე".

---

## 4. AdSense

1. [adsense.google.com](https://adsense.google.com)
2. თუ approved: Display ads → დააკოპირე slot id
3. Vercel → `pawswipegeo` → `VITE_ADSENSE_CONTENT_SLOT` = ციფრები
4. Redeploy

---

## 5. ლეპტოპი

```powershell
cd C:\Users\kodua\Projects
Rename-Item mipove.me mipove.me-old-backup
git clone https://github.com/koduaxodua/mipove.me.git
```

---

## 6. Instagram

1. Bio: `https://mipove.me/?utm_source=instagram&utm_medium=bio`
2. კონკრეტული ცხოველი: გაზიარების ლინკი + `?utm_source=instagram&utm_medium=reel`
3. შედეგები: Vercel → Analytics → UTM

---

## უფასო API-ები (უკვე ჩაშენებული)

- **Telegram Bot API** — ახალი ცხოველის ავტო-პოსტი არხზე (ნაბიჯი 3-ის შემდეგ)
- **Telegram Share** (`t.me/share`) — ცხოველის გვერდზე ლურჯი ღილაკი, ტოკენის გარეშე
- **OpenStreetMap + Nominatim** — რუკა და მისამართის ძებნა
- **catfact.ninja** — სვაიპის ბოლოს „ცნობისთვის" (public-apis სიიდან)
- **Vercel Analytics API** — მთვლელი „30 დღე · N სტუმარი"

dog.ceo / random cat photo APIs განზრახ არ ჩავამატე — რეალურ განცხადებებს აურევდა.
