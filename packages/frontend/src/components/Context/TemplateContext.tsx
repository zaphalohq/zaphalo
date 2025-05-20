import { createContext, useEffect, useState } from "react";

interface TemplateContextProps {
    templateFormData : any,
    setTemplateFormData : Function,
}

export const TemplateContext = createContext<TemplateContextProps | undefined>(undefined)


export const TemplateProvider = ({ children }: any) => {
  const [templateFormData, setTemplateFormData] = useState({
    account: '',
    templateName: '',
    category: 'UTILITY',
    language: 'en_US',
    bodyText: '',
    footerText: '',
    body_text: '',
    headerType: 'NONE',
    header_handle: '',
    button: [],
    variables : [],
  });

//   useEffect(() => {
//     console.log(templateFormData,".............................................");
    
//       },[templateFormData])


  return (
          <TemplateContext.Provider value={{
            templateFormData,
            setTemplateFormData
          }}>
              {children}
          </TemplateContext.Provider>
      )
}