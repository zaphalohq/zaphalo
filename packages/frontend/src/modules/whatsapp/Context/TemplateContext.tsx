import { useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

interface TemplateContextProps {
  templateData: any,
  setTemplateData: Function,
  attachment: any,
  setAttachment: Function
}

export const initTemplateData = {
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
    buttons: [],
    variables: [],
    attachmentId: null,
    templateImg: "",
  }

export const initAttachment = {
    attachmentId: '',
    originalname: '',
    name: '',
  }

export const TemplateContext = createContext<TemplateContextProps | undefined>(null)

export function TemplateProvider({ children }: { children: ReactNode }) {

  const [templateData, setTemplateData] = useState(initTemplateData);

  const [attachment, setAttachment] = useState(initAttachment);

  return (
    <TemplateContext.Provider value={{templateData, setTemplateData, attachment, setAttachment}}>
      {children}
    </TemplateContext.Provider>
  );
}