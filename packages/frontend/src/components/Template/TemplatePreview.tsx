const TemplatePreview = ({ formData }: any) => {

    // Format current time as HH:MM
    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div>
        <div className="flex flex-col justify-center items-start bg-white p-4 min-w-72 max-w-72">
            <div className="break-words">Headerfsdddddddddddddddddddddddddddddddddddd </div>
            <div className="break-words">{formData.bodyText}</div>
            <div>footer</div>
            {/* Timestamp */}
            {/* <span className="absolute bottom-1 right-2 text-xs text-gray-600">
                {getCurrentTime()}
              </span> */}
        </div>
        </div>
    );
};

export default TemplatePreview;