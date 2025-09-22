import { useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

interface TemplateContextProps {
  templateData: any,
  setTemplateData: Function,
}
export const TemplateContext = createContext<TemplateContextProps | undefined>(null)

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templateData, setTemplateData] = useState({
    templateId: '',
    templateName: '',
    whatsappAccountId: '',
    category: "",
    headerType: "",
    headerText: "",
    language: 'en_US',
    bodyText: `Hi {{1}},
Your order *{{2}}* from *{{3}}* has been shipped.
To track the shipping: {{4}}
Thank you.`,
    footerText: '',
    button: [],
    variables: [],
    attachmentId: null
  });

  return (
    <TemplateContext.Provider value={{templateData, setTemplateData}}>
      {children}
    </TemplateContext.Provider>
  );
}


// export const TemplateContext = createContext<TemplateContextProps | undefined>(undefined)

// export const TemplateProvider = ({ children }: any) => {
//   const templateContext = useContext(TemplateContext);
//   const [templateData, setTemplateData] = useState({
//     accountId: '',
//     templateName: '',
//     category: 'UTILITY',
//     language: 'en_US',
//     bodyText: `Hi {{1}},
// Your order *{{2}}* from *{{3}}* has been shipped.
// To track the shipping: {{4}}
// Thank you.`,
//     footerText: '',
//     headerType: 'NONE',
//     button: [],
//     variables: [],
//     headerText: '',
//     attachmentId: null
//   });

//   return (
//     <TemplateContext.Provider value={{
//       templateData,
//       setTemplateData,
//     }}>
//       {children}{templateData}
//     </TemplateContext.Provider>
//   )
// }

