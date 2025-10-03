
import MailingListSaveContact from "@src/components/MailingList/MailingListSaveContact";
import MailingListView from "@src/modules/mailingList/MailingListView";
import SaveContact from "@src/components/UI/SaveContact";
import SubmitButton from "@src/components/UI/SubmitButton";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiArrowLeft, FiX } from "react-icons/fi";
import MailingListForm from "@src/modules/mailingList/MailingListForm";

const MailingList = () => {
  const [isSaveMailingListVis, setIsSaveMailingListVis] = useState(false);
  const [isMailingContactVis, setIsMailingContactVis] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {isSaveMailingListVis ?
        <MailingListForm setIsSaveMailingListVis={setIsSaveMailingListVis} />
        :
        <MailingListView
          setIsMailingContactVis={setIsMailingContactVis}
          isMailingContactVis={isMailingContactVis}
          onCreate={() => {
            setIsSaveMailingListVis(true)
          }}
        />}
    </div>
  );
};

export default MailingList;

