import { facebookShareUrl, telegramShareUrl, whatsappShareUrl } from '@/lib/sharePet';
import { useLocale } from '@/contexts/Locale';

type Props = {
  dog: { id: string; name: string };
};

/** Telegram / WhatsApp / Facebook გაზიარება — უფასო URL სქემები. */
export function SocialShareRow({ dog }: Props) {
  const { locale } = useLocale();

  const items = [
    {
      key: 'telegram',
      href: telegramShareUrl(dog, locale),
      label: 'Telegram',
      className: 'border-[#2AABEE]/40 bg-[#2AABEE]/15 text-[#2AABEE] hover:bg-[#2AABEE]/25',
    },
    {
      key: 'whatsapp',
      href: whatsappShareUrl(dog, locale),
      label: 'WhatsApp',
      className: 'border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/25',
    },
    {
      key: 'facebook',
      href: facebookShareUrl(dog),
      label: 'Facebook',
      className: 'border-[#1877F2]/40 bg-[#1877F2]/15 text-[#1877F2] hover:bg-[#1877F2]/25',
    },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(item => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          onClick={() => console.log('[share]', item.key, { id: dog.id })}
          className={`inline-flex h-11 items-center justify-center rounded-full border text-xs font-semibold transition active:scale-[0.98] ${item.className}`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
