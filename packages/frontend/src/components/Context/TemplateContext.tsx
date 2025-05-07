import { createContext, useEffect, useState } from "react";

interface TemplateContextProps {
    templateFormData : any,
    setTemplateFormData : Function,
}

export const TemplateContext = createContext<TemplateContextProps | undefined>(undefined)


export const TemplateProvider = ({ children }: any) => {
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    category: 'UTILITY',
    language: 'en_US',
    headerText: '',
    bodyText: '',
    footerText: '',
    buttonText: '',
    buttonUrl: '',
    body_text: '',
    headerFormat: 'TEXT'
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