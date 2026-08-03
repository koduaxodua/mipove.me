import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ManualAdSlot } from './ContentPagesV2';

const CONTENT_AD_SLOT = import.meta.env.VITE_ADSENSE_CONTENT_SLOT || '';

const GUIDES = [
  {
    path: '/guide/dzaglis-ayvana',
    label: 'როგორ ავიყვანო ძაღლი ან კატა',
    blurb: 'სად ვიპოვო გასაჩუქებელი ცხოველი, რა მოვამზადო სახლში და რა ხარჯებს უნდა ელოდო.',
  },
  {
    path: '/guide/dakarguli-cxoveli',
    label: 'დაკარგული ცხოველი — პირველი 24 საათი',
    blurb: 'პრაქტიკული გეგმა: სად ეძებო, როგორ გაავრცელო განცხადება და როგორ აირიდო თაღლითები.',
  },
  {
    path: '/guide/miusafari-cxovelis-daxmareba',
    label: 'როგორ დავეხმარო მიუსაფარ ცხოველს',
    blurb: 'კვება, ვეტერინარი, დროებითი შეკედლება და განცხადების დამატება mipove.me-ზე.',
  },
];

/** /guide — სამივე სტატიის სია (აპიდან და Google-იდან მოსასვლელი გვერდი). */
export function GuideHubPage() {
  return (
    <GuideShell current="/guide">
      <H1>გზამკვლევები — ცხოველების დახმარება საქართველოში</H1>
      <P>
        მოკლე, პრაქტიკული სტატიები: აყვანა, დაკარგული ცხოველი და მიუსაფარის დახმარება. აირჩიე თემა და
        წაიკითხე ნაბიჯ-ნაბიჯ.
      </P>
      <div className="mt-8 space-y-3">
        {GUIDES.map(guide => (
          <Link
            key={guide.path}
            to={guide.path}
            className="block rounded-2xl border border-border/70 bg-card/70 p-5 transition hover:border-primary/40"
          >
            <span className="block text-base font-semibold text-foreground">{guide.label}</span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">{guide.blurb}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              წაკითხვა <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
      <GuideCta />
    </GuideShell>
  );
}

/**
 * ქართული SEO სტატიები — ამ გვერდებზე მოდის ტრაფიკი Google-იდან
 * ("ძაღლის აყვანა", "დაკარგული ძაღლი" და მსგავსი ძიებებით).
 */
function GuideShell({ current, children }: { current: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/guide" className="flex items-center gap-3">
            <img src="/brand/logo-dark.png" alt="mipove.me" className="h-10 w-10 rounded-2xl object-contain" />
            <div className="leading-tight">
              <span className="block text-base font-bold">mipove.me</span>
              <span className="text-xs text-muted-foreground">გზამკვლევები</span>
            </div>
          </Link>
          <Link
            to="/"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            აპის გახსნა
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 pb-16 pt-8">{children}</article>

      <footer className="border-t border-border/60 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold text-foreground">სხვა გზამკვლევები</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {current !== '/guide' && (
              <Link to="/guide" className="text-muted-foreground underline underline-offset-2 hover:text-foreground">
                ყველა გზამკვლევი
              </Link>
            )}
            {GUIDES.filter(guide => guide.path !== current).map(guide => (
              <Link
                key={guide.path}
                to={guide.path}
                className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                {guide.label}
              </Link>
            ))}
            <Link to="/ka/privacy" className="text-muted-foreground underline underline-offset-2 hover:text-foreground">
              კონფიდენციალურობა
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">{children}</h1>;
}

function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-8 text-lg font-semibold text-foreground sm:text-xl">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{children}</p>;
}

function Ul({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground sm:text-base">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function GuideCta({ addPet }: { addPet?: boolean }) {
  return (
    <div className="mt-10 rounded-2xl border border-primary/25 bg-primary/10 p-6 text-center">
      <p className="text-base font-semibold text-foreground">
        {addPet ? 'ნახე ვინ ელოდება ოჯახს ან დაამატე შენი განცხადება' : 'ცხოველები ამ წუთასაც ელოდებიან ოჯახს'}
      </p>
      <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground transition hover:opacity-90"
        >
          ცხოველების ნახვა <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/add"
          className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-secondary/70 px-6 font-semibold text-foreground transition hover:bg-secondary"
        >
          განცხადების დამატება
        </Link>
      </div>
    </div>
  );
}

export function GuideAdoptPage() {
  return (
    <GuideShell current="/guide/dzaglis-ayvana">
      <H1>როგორ ავიყვანო ძაღლი ან კატა საქართველოში — სრული გზამკვლევი</H1>
      <P>
        ცხოველის აყვანა ერთ-ერთი ყველაზე კარგი გადაწყვეტილებაა, რომელსაც მიიღებ — და საქართველოში ათასობით
        მიუსაფარი ძაღლი და კატა ელოდება ოჯახს. ეს გზამკვლევი ნაბიჯ-ნაბიჯ გეტყვის, სად ეძებო გასაჩუქებელი
        ცხოველი, რა მოამზადო სახლში და რა ხარჯებს უნდა ელოდო.
      </P>

      <H2>სად ვიპოვო გასაჩუქებელი ძაღლი ან კატა</H2>
      <Ul
        items={[
          <>
            <Link to="/" className="text-primary underline underline-offset-2">mipove.me-ზე</Link> — ნახავ მიუსაფარი და
            გასაჩუქებელი ცხოველების განცხადებებს ფოტოთი, აღწერით და მომვლელის კონტაქტით. ყველა განცხადებას აქვს
            დაახლოებითი ლოკაცია რუკაზე.
          </>,
          'მუნიციპალური თავშესაფრები — თბილისში და დიდ ქალაქებში მოქმედებს თავშესაფრები, სადაც ცხოველის აყვანა უფასოა.',
          'მოხალისეების ჯგუფები სოციალურ ქსელებში — ბევრი ცხოველი დროებით შემკედლებელთანაა და პირდაპირ მისგან აჰყავთ.',
          'ქუჩიდან — თუ კონკრეტული ცხოველი უკვე შეიყვარე, პირველი ნაბიჯი ვეტერინართან ვიზიტია.',
        ]}
      />

      <H2>რატომ აყვანა და არა ყიდვა</H2>
      <P>
        ნაყიდი ლეკვი ჯიშიანი იქნება, მაგრამ აყვანილი ცხოველი — გადარჩენილი სიცოცხლე. მეტიც: ნარევი ჯიშის
        ცხოველები ხშირად უფრო ჯანმრთელები არიან, ნაკლებად აქვთ გენეტიკური დაავადებები და ისეთივე ერთგულები
        არიან, როგორც ნებისმიერი ჯიშიანი. თან აყვანა თითქმის უფასოა — ძირითადი ხარჯი მხოლოდ ვეტერინარია.
      </P>

      <ManualAdSlot slot={CONTENT_AD_SLOT} />

      <H2>რა მოამზადო სახლში</H2>
      <Ul
        items={[
          'საწოლი ან რბილი საგები მშვიდ კუთხეში',
          'ორი თასი — საკვების და წყლის',
          'ასაკის შესაბამისი საკვები (ლეკვს/კნუტს სპეციალური სჭირდება)',
          'კატისთვის — სველი წერტილი (ქვიშიანი ყუთი), ძაღლისთვის — საბელი და საყელო',
          'სატრანსპორტო ჩანთა ან ყუთი ვეტერინართან წასაყვანად',
        ]}
      />

      <H2>ვეტერინარი, ვაქცინაცია და დოკუმენტები</H2>
      <P>
        პირველივე კვირაში წაიყვანე ცხოველი ვეტერინართან: ზოგადი შემოწმება, პარაზიტების საწინააღმდეგო
        მკურნალობა და ვაქცინაციის გეგმა. აუცილებელი ვაქცინებია ცოფის და კომბინირებული ვაქცინა. იკითხე
        სტერილიზაციაზეც — ეს ცხოველის ჯანმრთელობისთვისაც სასარგებლოა და ქუჩის ცხოველების რაოდენობასაც
        ამცირებს. ზოგიერთი კლინიკა და პროგრამა სტერილიზაციას შეღავათიან ფასად ან უფასოდ აკეთებს.
      </P>
      <P>
        მიახლოებითი ხარჯები: ვეტერინარის ვიზიტი — 30–70 ლარი, ვაქცინა — 20–50 ლარი, სტერილიზაცია — 80–250
        ლარი, თვიური საკვები — 40–150 ლარი ცხოველის ზომის მიხედვით. ეს თანხები ორიენტირია და კლინიკების
        მიხედვით განსხვავდება.
      </P>

      <H2>პირველი კვირა ახალ სახლში</H2>
      <P>
        ცხოველს ადაპტაციისთვის დრო სჭირდება — ზოგს რამდენიმე დღე, ზოგს რამდენიმე კვირა. ნუ აიძულებ კონტაქტს,
        მიეცი საშუალება თავად მოვიდეს შენთან. შეინარჩუნე კვების და გასეირნების სტაბილური განრიგი. თუ სახლში
        სხვა ცხოველი გყავს, გააცანი ისინი ეტაპობრივად, ნეიტრალურ სივრცეში.
      </P>

      <GuideCta />
    </GuideShell>
  );
}

export function GuideLostPage() {
  return (
    <GuideShell current="/guide/dakarguli-cxoveli">
      <H1>დაკარგული ძაღლი ან კატა — რა უნდა გააკეთო პირველ 24 საათში</H1>
      <P>
        პირველი 24 საათი ყველაზე მნიშვნელოვანია დაკარგული ცხოველის საპოვნელად. რაც უფრო სწრაფად და
        ორგანიზებულად იმოქმედებ, მით მეტია შანსი. აი, კონკრეტული გეგმა.
      </P>

      <H2>პირველი 2 საათი — მოძებნე ახლოს</H2>
      <Ul
        items={[
          'დაკარგვის ადგილიდან დაიწყე და წრეებად გააფართოვე ძებნა. ძაღლები ხშირად ნაცნობი მარშრუტით მიდიან.',
          'კატა თითქმის ყოველთვის ახლოსაა — შეამოწმე სარდაფები, მანქანების ქვეშ, ეზოს ბუჩქები, სახურავები.',
          'დაუძახე მშვიდი ხმით და დაელოდე. შეშინებული ცხოველი შეიძლება იმალებოდეს და ვერ გამოვიდეს.',
          'ღამით ძებნა ფარნით ხშირად უფრო ეფექტურია — ქუჩა ცარიელია და ცხოველის თვალები შუქზე ანათებს.',
          'დატოვე დაკარგვის ადგილას შენი ტანსაცმლის ნაჭერი ან ცხოველის საწოლი — ნაცნობი სუნი აბრუნებს.',
        ]}
      />

      <H2>გაავრცელე ინფორმაცია მაშინვე</H2>
      <Ul
        items={[
          <>
            დაამატე განცხადება <Link to="/add" className="text-primary underline underline-offset-2">mipove.me-ზე</Link> —
            ფოტო, ბოლო ნახვის ადგილი რუკაზე და შენი ნომერი. განცხადების ლინკის გაზიარება ერთი ღილაკით შეიძლება.
          </>,
          'დაპოსტე უბნის Facebook ჯგუფებში და დაკარგული ცხოველების ჯგუფებში.',
          'გააფრთხილე მეზობლები, კონსიერჟი, ეზოს დამლაგებელი, მაღაზიის გამყიდველები — ისინი მთელი დღე ქუჩაში არიან.',
          'დაურეკე ან მიწერე ახლომდებარე ვეტკლინიკებს — დაშავებულ ცხოველს ხშირად პირდაპირ კლინიკაში მიჰყავთ.',
        ]}
      />

      <ManualAdSlot slot={CONTENT_AD_SLOT} />

      <H2>რა უნდა ეწეროს განცხადებაში</H2>
      <Ul
        items={[
          'ნათელი ფოტო (თუ რამდენიმე გაქვს — სხვადასხვა კუთხიდან)',
          'სად და როდის დაიკარგა — ქუჩა, უბანი, დრო',
          'გამორჩეული ნიშნები: საყელო, ნაწიბური, ფერი, ზომა',
          'ეშინია თუ მეგობრულია — რომ მპოვნელმა იცოდეს როგორ მიუდგეს',
          'შენი ტელეფონი',
        ]}
      />

      <H2>ფრთხილად თაღლითებთან</H2>
      <P>
        სამწუხაროდ, დაკარგული ცხოველის განცხადებებზე თაღლითებიც პასუხობენ. არავის გადაურიცხო თანხა წინასწარ
        — „ვიპოვე, ჯერ გადმორიცხე და მერე მოგიყვან" თითქმის ყოველთვის მოტყუებაა. სთხოვე ცხოველის ახალი ფოტო
        ან ვიდეო ზუსტი დეტალით, რომელიც მხოლოდ შენ იცი.
      </P>

      <H2>თუ სხვისი ცხოველი იპოვე</H2>
      <P>
        შეამოწმე საყელო და საიდენტიფიკაციო ჟეტონი, ვეტკლინიკაში კი — მიკროჩიპი (სკანირება უფასოა). დაამატე
        „ნაპოვნია" განცხადება mipove.me-ზე ფოტოთი და ადგილით — პატრონი სავარაუდოდ ეძებს.
      </P>

      <GuideCta addPet />
    </GuideShell>
  );
}

export function GuideHelpPage() {
  return (
    <GuideShell current="/guide/miusafari-cxovelis-daxmareba">
      <H1>როგორ დავეხმარო მიუსაფარ ცხოველს — პრაქტიკული გზამკვლევი</H1>
      <P>
        ქუჩაში მიუსაფარი ძაღლის ან კატის დანახვისას ბევრს უჩნდება კითხვა: „რით შემიძლია დავეხმარო?" პასუხი
        მარტივია — ცოტათი დახმარებაც კი ცვლის ცხოველის ბედს. აი, რა შეგიძლია გააკეთო დღესვე.
      </P>

      <H2>ჯერ შეაფასე სიტუაცია</H2>
      <P>
        მიუახლოვდი ნელა და გვერდიდან, პირდაპირი მზერის გარეშე. თუ ცხოველი აგრესიულია, კბენს ან ძალიან
        შეშინებულია — ნუ შეეხები, ჯობია დისტანციიდან დაეხმარო (საკვები, განცხადება). დაშავებული ცხოველი
        ტკივილისგან შეიძლება იკბინოს, ამიტომ გადაყვანისას გამოიყენე პლედი ან ყუთი.
      </P>

      <H2>საკვები და წყალი</H2>
      <Ul
        items={[
          'ყველაზე უსაფრთხოა ძაღლის/კატის მშრალი საკვები — იაფია და ყველა მარკეტში იშოვება',
          'შეიძლება: მოხარშული ქათამი, ბრინჯი, უმარილო ხორცი',
          'არ შეიძლება: შოკოლადი, ყურძენი/ქიშმიში, ხახვი, მოხარშული ძვლები, შემწვარი და მარილიანი საკვები',
          'წყალი ზაფხულში სასიცოცხლოდ მნიშვნელოვანია — ერთჯერადი ჭურჭლით დადგმაც საქმეა',
        ]}
      />

      <H2>დაშავებული ან ავადმყოფი ცხოველი</H2>
      <P>
        თუ ცხოველი დაშავებულია, პირველ რიგში ვეტერინარს დაუკავშირდი — ბევრი კლინიკა ღამეც მუშაობს. გადაყვანა
        შეიძლება ტაქსით (წინასწარ უთხარი მძღოლს) ან საკუთარი მანქანით. ვიზიტის ღირებულება ჩვეულებრივ 30–70
        ლარია; მოხალისეების ჯგუფები ზოგჯერ ხარჯების გაზიარებაში ეხმარებიან.
      </P>

      <ManualAdSlot slot={CONTENT_AD_SLOT} />

      <H2>დაამატე განცხადება — ოჯახი უფრო მალე გამოჩნდება</H2>
      <P>
        ერთი ფოტო და ორი წინადადება საკმარისია: დაამატე ცხოველი{' '}
        <Link to="/add" className="text-primary underline underline-offset-2">mipove.me-ზე</Link>, მონიშნე
        დაახლოებითი ადგილი რუკაზე და მიუთითე შენი ნომერი, თუ დროებით შეკედლება შეგიძლია. განცხადებას აქვს
        საკუთარი ლინკი, რომელსაც სოციალურ ქსელებში გააზიარებ — ასე ცხოველს ბევრად მეტი ადამიანი ხედავს.
      </P>

      <H2>დროებითი შეკედლება</H2>
      <P>
        თუ ცხოველის სახლში დროებით შეყვანა შეგიძლია, ეს მისი გადარჩენის ყველაზე დიდი შანსია. გამოუყავი ცალკე
        ოთახი ან კუთხე, სანამ ვეტერინარი შეამოწმებს (განსაკუთრებით თუ სხვა ცხოველი გყავს სახლში). ორ კვირაში
        ცხოველი ადაპტირდება და ფოტოებზეც უკეთ გამოჩნდება — მიკედლების შანსიც იზრდება.
      </P>

      <H2>სტერილიზაცია — გრძელვადიანი დახმარება</H2>
      <P>
        ერთი სტერილიზებული კატა ან ძაღლი ათობით მომავალ მიუსაფარ ცხოველს ნიშნავს ნაკლებს. თუ შენს უბანში
        ქუჩის ცხოველები ცხოვრობენ, მოიკითხე მუნიციპალური ან სათემო სტერილიზაციის პროგრამები — ხშირად ეს
        სერვისი უფასოა ან შეღავათიანი.
      </P>

      <GuideCta />
    </GuideShell>
  );
}
