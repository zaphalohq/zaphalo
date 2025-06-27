import { createContext, useEffect, useState } from "react";

interface TemplateContextProps {
  templateFormData: any,
  setTemplateFormData: Function,
  templateData: any,
  setTemplateData: Function
}

export const TemplateContext = createContext<TemplateContextProps | undefined>(undefined)


export const TemplateProvider = ({ children }: any) => {
  const [templateFormData, setTemplateFormData] = useState({
    account: '',
    templateName: '',
    category: 'UTILITY',
    language: 'en_US',
    bodyText: `Hi {{1}},
Your order *{{2}}* from *{{3}}* has been shipped.
To track the shipping: {{4}}
Thank you.`,
    footerText: '',
    headerType: 'NONE',
    header_handle: '',
    button: [],
    variables: [],
    fileUrl: ''
  });

  const [templateData, setTemplateData] = useState({
    account: '',
    templateName: '',
    category: 'UTILITY',
    language: 'en_US',
    bodyText: `Hi {{1}},
Your order *{{2}}* from *{{3}}* has been shipped.
To track the shipping: {{4}}
Thank you.`,
    footerText: '',
    button: [],
    variables: [],
    headerType: 'NONE',
    header_handle: '',
    fileUrl: ''
  });

  //   useEffect(() => {
  //     console.log(templateFormData,".............................................");

  //       },[templateFormData])


  return (
    <TemplateContext.Provider value={{
      templateFormData,
      setTemplateFormData,
      templateData,
      setTemplateData
    }}>
      {children}
    </TemplateContext.Provider>
  )
}