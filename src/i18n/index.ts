import i18n from 'i18next';
import { initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vn from './vn.json';
import en from './en.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng:'vn',
        resources: {
            en: { translation: en },
            vn:{translation:vn}
        },
        interpolation: {
            escapeValue: false,
        }
    })
export default i18n;