import { SUPPORTED_LANGUAGES } from "@renderer/i18n";
import { cn } from "@renderer/lib/utils";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGE_NATIVE_NAMES: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({
  className,
}: LanguageSelectorProps): React.JSX.Element {
  const { i18n } = useTranslation();

  const currentLang = (SUPPORTED_LANGUAGES as readonly string[]).includes(
    i18n.language,
  )
    ? i18n.language
    : "en";

  return (
    <div
      className={cn(
        "border-border bg-card text-foreground flex w-full max-w-xs items-center gap-2 rounded-lg border px-3 py-2 text-sm",
        className,
      )}
    >
      <Globe className="text-muted-foreground h-4 w-4 shrink-0" />
      <select
        value={currentLang}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="w-full min-w-0 truncate bg-transparent pr-6 outline-none"
        aria-label="Interface language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_NATIVE_NAMES[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}
