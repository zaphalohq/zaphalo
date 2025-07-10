import React from 'react'

const LanguageCode = ({ templateData, handleInputChange }: any) => {

    const languages = [
        { value: "af", label: "Afrikaans" },
        { value: "sq", label: "Albanian" },
        { value: "ar", label: "Arabic" },
        { value: "az", label: "Azerbaijani" },
        { value: "bn", label: "Bengali" },
        { value: "bg", label: "Bulgarian" },
        { value: "ca", label: "Catalan" },
        { value: "zh_CN", label: "Chinese (CHN)" },
        { value: "zh_HK", label: "Chinese (HKG)" },
        { value: "zh_TW", label: "Chinese (TAI)" },
        { value: "hr", label: "Croatian" },
        { value: "cs", label: "Czech" },
        { value: "da", label: "Danish" },
        { value: "nl", label: "Dutch" },
        { value: "en", label: "English" },
        { value: "en_GB", label: "English (UK)" },
        { value: "en_US", label: "English (US)" },
        { value: "et", label: "Estonian" },
        { value: "fil", label: "Filipino" },
        { value: "fi", label: "Finnish" },
        { value: "fr", label: "French" },
        { value: "ka", label: "Georgian" },
        { value: "de", label: "German" },
        { value: "el", label: "Greek" },
        { value: "gu", label: "Gujarati" },
        { value: "ha", label: "Hausa" },
        { value: "he", label: "Hebrew" },
        { value: "hi", label: "Hindi" },
        { value: "hu", label: "Hungarian" },
        { value: "id", label: "Indonesian" },
        { value: "ga", label: "Irish" },
        { value: "it", label: "Italian" },
        { value: "ja", label: "Japanese" },
        { value: "kn", label: "Kannada" },
        { value: "kk", label: "Kazakh" },
        { value: "rw_RW", label: "Kinyarwanda" },
        { value: "ko", label: "Korean" },
        { value: "ky_KG", label: "Kyrgyz (Kyrgyzstan)" },
        { value: "lo", label: "Lao" },
        { value: "lv", label: "Latvian" },
        { value: "lt", label: "Lithuanian" },
        { value: "mk", label: "Macedonian" },
        { value: "ms", label: "Malay" },
        { value: "ml", label: "Malayalam" },
        { value: "mr", label: "Marathi" },
        { value: "nb", label: "Norwegian" },
        { value: "fa", label: "Persian" },
        { value: "pl", label: "Polish" },
        { value: "pt_BR", label: "Portuguese (BR)" },
        { value: "pt_PT", label: "Portuguese (POR)" },
        { value: "pa", label: "Punjabi" },
        { value: "ro", label: "Romanian" },
        { value: "ru", label: "Russian" },
        { value: "sr", label: "Serbian" },
        { value: "sk", label: "Slovak" },
        { value: "sl", label: "Slovenian" },
        { value: "es", label: "Spanish" },
        { value: "es_AR", label: "Spanish (ARG)" },
        { value: "es_ES", label: "Spanish (SPA)" },
        { value: "es_MX", label: "Spanish (MEX)" },
        { value: "sw", label: "Swahili" },
        { value: "sv", label: "Swedish" },
        { value: "ta", label: "Tamil" },
        { value: "te", label: "Telugu" },
        { value: "th", label: "Thai" },
        { value: "tr", label: "Turkish" },
        { value: "uk", label: "Ukrainian" },
        { value: "ur", label: "Urdu" },
        { value: "uz", label: "Uzbek" },
        { value: "vi", label: "Vietnamese" },
        { value: "zu", label: "Zulu" },
    ];

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select name='language'
                value={templateData.language}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                required
            >
                { languages.map((language : any, index ) => 
                 <option key={index} className="text-black" value={language.value}>{language.label}</option>
                 )}
            </select>
        </div>
    )
}

export default LanguageCode
