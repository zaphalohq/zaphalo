import { FiExternalLink } from "react-icons/fi";
import { TemplateContext } from "@Context/TemplateContext";
import { useContext } from "react";

const TemplatePreview = () => {
  const { templateFormData }: any = useContext(TemplateContext)

  // Format current time as HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
    { templateFormData.headerType !== 'NONE' || templateFormData.footerText || templateFormData.bodyText?
     <div className="bg-white max-w-xs min-w-xs mx-auto overflow-hidden shadow-md font-sans border border-[#d0e3ea] pb-1">
      {/* Header with image */}
      <div className="relative">
        {templateFormData.headerType === 'IMAGE' ? <img
          // src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=400&q=80"
          src={templateFormData.header_handle}
          alt="Media"
          className="w-full min-h-50 max-h-70 object-cover p-2 rounded"
        /> : <></>}
        {templateFormData.headerType === 'TEXT' ? <div className="px-3 pt-2 pb-1 font-semibold">{templateFormData.header_handle}</div>
          : <></>
        }
      </div>

      {/* Body */}
      <div className="px-3 pb-2 text-sm text-gray-800">
        <p className="mb-2 whitespace-pre-line">
          {templateFormData.bodyText}
        </p>
      </div>


      {/* Footer */}
      <div className="px-3 pb-2 border-b-2 border-gray-200 flex justify-between ">
        <p className="text-[13.5px] text-gray-500">{templateFormData.footerText}</p>
        <p className="text-[10px] text-gray-500 self-end">12:00</p>
      </div>
      {JSON.stringify(templateFormData.button) !== '[]' ? 
        templateFormData.button.map((button : any) => <div className="flex gap-2 items-center justify-center p-2 text-blue-600 ">
        <FiExternalLink />
        <button className="text-sm font-semibold text-left">
          {button.text}
        </button>
      </div>)
       : <></>
        }
    </div>
    : <></>}
    </>
  );
};



export default TemplatePreview;