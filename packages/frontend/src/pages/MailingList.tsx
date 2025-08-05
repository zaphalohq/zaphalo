
import MailingListSaveContact from "@src/components/MailingList/MailingListSaveContact";
import MailingListView from "@src/components/MailingList/MailingListView";
import SaveMailingList from "@src/components/MailingList/SaveMailingList";
import SaveContact from "@src/components/UI/SaveContact";
import SubmitButton from "@src/components/UI/SubmitButton";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiArrowLeft, FiX } from "react-icons/fi";

const MailingList = () => {
  const [isSaveMailingListVis, setIsSaveMailingListVis] = useState(false);
  const [isMailingContactVis, setIsMailingContactVis] = useState(false);

  return (
    <div>
      <div className='font-bold text-lg border-gray-300 p-4 border-b'>Contact List</div>
      {(!isSaveMailingListVis && !isMailingContactVis) &&
        <div className="grid grid-cols-4 pt-4 px-4 ">
          <div className="md:col-start-8 md:pb-0 col-start-1 col-end-8 pb-4">
            <SubmitButton type='button' onClick={() => setIsSaveMailingListVis(true)} title="Import" Icon={FaPlus} />
          </div>
        </div>
      }
      {(isSaveMailingListVis || isMailingContactVis) &&
        <div onClick={() => {
          if(isSaveMailingListVis){
          setIsSaveMailingListVis(false)
          }
          if(isMailingContactVis){
            setIsMailingContactVis(false)
          }
        }}
          className='mx-6 mt-4 flex items-center justify-center h-10 w-10 rounded-full bg-violet-400 hover:bg-violet-500 cursor-pointer text-white text-lg font-bold'>
          <FiArrowLeft />
        </div>
      }

      {isSaveMailingListVis ?
        <SaveMailingList setIsSaveMailingListVis={setIsSaveMailingListVis} />
        :
        <MailingListView setIsMailingContactVis={setIsMailingContactVis} isMailingContactVis={isMailingContactVis} />}

    </div>
  );
};

export default MailingList;

