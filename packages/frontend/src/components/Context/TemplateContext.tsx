import { createContext, useEffect, useState } from "react";

interface TemplateContextProps {
    templateFormData : any,
    setTemplateFormData : Function,
}

export const TemplateContext = createContext<TemplateContextProps | undefined>(undefined)


export const TemplateProvider = ({ children }: any) => {
  const [templateFormData, setTemplateFormData] = useState({
    account: '',
    name: '',
    category: 'UTILITY',
    language: 'en_US',
    headerText: '',
    bodyText: `Hi {{1}},Your order *{{2}}* from *{{3}}* has been shipped.To track the shipping: {{4}}.Thank you`,
    footerText: '',
    buttonText: '',
    buttonUrl: '',
    body_text: '',
    headerFormat: 'NONE',
    header_handle: '',
    imageUrl: ''
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