import { useState } from 'react';
import { Check, Copy, Landmark } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocale } from '@/contexts/Locale';

const BANK_ACCOUNT = 'GE81BG0000000604690174';

async function copyBankAccount(): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(BANK_ACCOUNT);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = BANK_ACCOUNT;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Clipboard unavailable');
}

/**
 * BottomNav-ის ღილაკი, რომელიც ხსნის დონაციის საბანკო რეკვიზიტებს (Bank of Georgia · GEL).
 * ანგარიშის მფლობელის სახელი განზრახ არ ჩანს.
 */
export function SupportBankDetails() {
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);
  const en = locale === 'en';

  return (
    <Popover
      onOpenChange={open => {
        if (open) console.log('[support] Bank details opened');
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl text-foreground/60 transition-all duration-200 hover:text-foreground"
          aria-label={en ? 'Bank details' : 'საბანკო რეკვიზიტები'}
        >
          <Landmark className="h-5 w-5" aria-hidden="true" />
          <span className="text-[10px] font-medium">{en ? 'Bank' : 'რეკვიზიტები'}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" side="top" sideOffset={8} className="w-[min(18rem,calc(100vw-2rem))] rounded-lg p-3">
        <p className="text-xs font-semibold">{en ? 'Support mipove.me' : 'mipove.me-ის მხარდაჭერა'}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">{en ? 'Bank of Georgia · GEL' : 'საქართველოს ბანკი · GEL'}</p>
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-secondary/70 p-1.5 pl-2">
          <code className="min-w-0 flex-1 break-all text-[11px] font-semibold text-foreground">{BANK_ACCOUNT}</code>
          <button
            type="button"
            onClick={async () => {
              try {
                await copyBankAccount();
                setCopied(true);
                console.log('[support] Bank account copied');
                window.setTimeout(() => setCopied(false), 1800);
              } catch (error) {
                console.error('[support] Could not copy bank account', error);
              }
            }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-primary hover:bg-primary/10"
            aria-label={en ? 'Copy IBAN' : 'IBAN-ის კოპირება'}
            title={en ? 'Copy IBAN' : 'IBAN-ის კოპირება'}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          {en ? 'Purpose: mipove.me support' : 'დანიშნულება: mipove.me-ის მხარდაჭერა'}
        </p>
      </PopoverContent>
    </Popover>
  );
}
