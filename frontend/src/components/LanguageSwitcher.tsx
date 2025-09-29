import { useTranslation } from "react-i18next";
import Twemoji from "react-twemoji";

type Language = {
  code: string;
  label: string;
  icon: string;
};

const languages: Language[] = [
  { code: "en", label: "en", icon: "🇬🇧" },
  { code: "sw", label: "sw", icon: "🇹🇿" },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="flex items-center">
      <Twemoji options={{ className: "mr-2 w-4 h-4" }}>🌐</Twemoji>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`
            flex items-center mr-2 px-1.5 py-0.5 border rounded 
            text-sm transition-all
            ${
              currentLanguage === lang.code
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
            }
          `}
        >
          <Twemoji options={{ className: "inline mr-1 w-3 h-3" }}>
            <span>{lang.icon}</span>
          </Twemoji>
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
