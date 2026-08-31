# Oranz Body Spa — Birthday CRM (Live Version)

Ye woh dashboard hai jo tumne dekha, lekin ab real database (Supabase) aur real
WhatsApp bhejne wale Twilio API se connect hai. Roz subah ek automatic job
chalega jo aaj ke birthday wale clients ko khud WhatsApp wish bhej dega.

## Kya-kya chahiye (sab free tier pe kaam ho jayega)

1. **Supabase account** — https://supabase.com (database ke liye)
2. **Twilio account jo tumhare paas already hai** — WhatsApp bhejne ke liye
3. **GitHub account** — code push karne ke liye
4. **Vercel account** — https://vercel.com (hosting + daily cron job ke liye)

## Step-by-step setup

### 1. Supabase database banao
- supabase.com pe naya project banao
- Left sidebar mein "SQL Editor" kholo, "New query" pe click karo
- Is folder ki `supabase-schema.sql` file ka pura content paste karo aur **Run** dabao
- Isse `clients` aur `wish_log` naam ki do tables ban jayengi (with 3 sample clients)
- "Project Settings -> API" mein jao aur ye 3 cheezein copy kar lo:
  - Project URL
  - anon public key
  - service_role key (isko kisi ke saath share mat karna)

### 2. Twilio WhatsApp details nikaalo
- console.twilio.com pe login karo
- Account SID aur Auth Token "Account Info" mein milega
- Agar sandbox use kar rahe ho to WhatsApp number `whatsapp:+14155238886` hota hai;
  agar approved business number hai to wo daalo

### 3. `.env.local` file banao
Is folder mein `.env.example` ki copy banao aur naam do `.env.local`, phir
upar wali saari values usme daal do:

```
cp .env.example .env.local
```

`CRON_SECRET` mein khud koi bhi random lamba text likh do (jaise password).

### 4. Local pe test karo
```
npm install
npm run dev
```
Browser mein http://localhost:3000 kholo — dashboard dikhega, ab real Supabase
data ke saath.

### 5. GitHub pe push karo
```
git init
git add .
git commit -m "Oranz Body Spa live dashboard"
```
Phir GitHub pe ek naya repository banao aur usme push kar do (GitHub khud
commands dikha dega jab repo banaoge).

### 6. Vercel pe deploy karo
- vercel.com pe "Import Project" se apna GitHub repo connect karo
- Deploy karne se pehle "Environment Variables" section mein `.env.local`
  ki saari values daal do (ek-ek karke, exact same naam se)
- Deploy dabao — 1-2 minute mein live link mil jayega

### 7. Cron job apne aap chalu ho jayega
`vercel.json` mein already schedule set hai — roz **subah 9:00 baje (IST)**
Vercel khud `/api/cron/birthday-wishes` ko call karega, jo:
1. Database mein aaj ke birthday wale sabhi Active clients dhoondega
2. Har ek ko Twilio se WhatsApp wish bhejega
3. `wish_log` table mein likh dega taaki dobara same din wish na jaaye

Agar time badalna ho, `vercel.json` mein cron ka time change kar sakte ho
(format UTC time mein hai — 30 3 * * * matlab 3:30 AM UTC = 9:00 AM IST).

## Abhi kya baaki hai (agar chaho to aage bana sakte hain)

- **Email automatic bhejna** — abhi sirf WhatsApp automatic hai; email ke liye
  SendGrid ya Resend jaisi service jodni padegi
- **Login/password** — abhi koi bhi is link ko khol ke dashboard dekh sakta
  hai; staff-only banane ke liye authentication add karna hoga
- **Client edit/delete** — abhi sirf "Add Client" API bana hai
